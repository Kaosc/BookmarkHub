import React, { memo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { editGroupTitle, moveSelectedBookmarks } from "../../redux/features/bookmarkSlice"

import { MdDeleteForever, MdOutlineCancel } from "react-icons/md"
import { AiFillEdit, AiOutlineSave } from "react-icons/ai"
import { RxDragHandleHorizontal } from "react-icons/rx"
import { RiFolderTransferLine } from "react-icons/ri"

import { toggleSelectionMode } from "../../redux/features/selectionSlice"

function Group({
	group,
	activeGroup,
	handleConfirmFormVisible,
	quitFrom,
}: {
	group: BookmarkData
	activeGroup?: BookmarkData
	handleConfirmFormVisible: (e?: React.MouseEvent<HTMLButtonElement>, groupId?: string) => void
	quitFrom: (e: React.MouseEvent<HTMLButtonElement>) => void
}) {
	const dispatch = useDispatch()
	const { selectionMode, selectedBookmarks } = useSelector((state: RootState) => state.selection)
	
	const [title, setTitle] = useState(group.title)
	const [titleEditMode, setTitleEditMode] = useState(false)

	const inputRef = useRef<HTMLInputElement>(null)

	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: group.id })
	const style = {
		transform: CSS.Transform.toString({
			y: transform?.y ?? 0,
			x: 0,
			scaleX: transform?.scaleX ?? 1,
			scaleY: transform?.scaleY ?? 1,
		}),
		transition,
	}

	const handleOnGroupDelete = (e: React.MouseEvent<HTMLButtonElement>) =>
		handleConfirmFormVisible(e, group.id)

	const handleMoveSelectedBookmarks = (e: React.MouseEvent<HTMLButtonElement>) => {
		dispatch(
			moveSelectedBookmarks({
				selectedBookmarks: selectedBookmarks,
				toGroupId: group.id,
			})
		)
		dispatch(toggleSelectionMode())
		quitFrom(e)
	}

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value)
	}

	const toggleTitleEditMode = () => {
		setTitleEditMode((prev) => !prev)
		inputRef.current?.focus()
	}

	const saveTitleChanges = () => {
		dispatch(editGroupTitle({ id: group.id, title: title }))
		toggleTitleEditMode()
	}

	const resetTitleChange = () => {
		setTitle(group.title)
		toggleTitleEditMode()
	}

	if (group.id !== "default" || selectionMode) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				{...listeners}
				{...attributes}
				className={`
					flex items-center justify-start w-full p-1 my-2 ring-1 ring-zinc-500 rounded-md 
					${activeGroup?.id === group.id && "bg-zinc-800 ring-[2px]"} 
					${!selectionMode ? (activeGroup ? "cursor-grabbing" : "cursor-grab") : "cursor-pointer"}
				`}
			>
				<div className="flex items-center justify-start w-52">
					{!selectionMode && (
						<RxDragHandleHorizontal
							size={26}
							className={`text-black dark:text-white`}
						/>
					)}
					<input
						className="ml-1 pl-1 rounded-md truncate max-w-[190px] bg-transparent text-black dark:text-white enabled:bg-zinc-800"
						type="text"
						ref={inputRef}
						disabled={!titleEditMode}
						value={title}
						onChange={handleTitleChange}
					/>
				</div>

				{/* delete */}
				{selectionMode ? (
					<button
						className="ml-auto text-black dark-text-white hover:opacity-50 hover:animate-pulse"
						onClick={handleMoveSelectedBookmarks}
					>
						<RiFolderTransferLine
							size={20}
							className="text-black dark:text-white"
						/>
					</button>
				) : (
					<div className="flex items-center justify-end w-full">
						{titleEditMode ? (
							<button
								className="ml-auto text-black dark-text-white hover:opacity-50 hover:animate-pulse"
								onClick={saveTitleChanges}
							>
								<AiOutlineSave
									size={20}
									className="text-black dark:text-white"
								/>
							</button>
						) : (
							<button
								className="ml-auto text-black dark-text-white hover:opacity-50 hover:animate-pulse"
								onClick={toggleTitleEditMode}
							>
								<AiFillEdit
									size={20}
									className="text-black dark:text-white"
								/>
							</button>
						)}

						{titleEditMode ? (
							<button
								className="ml-auto text-black dark-text-white hover:opacity-50 hover:animate-pulse"
								onClick={resetTitleChange}
							>
								<MdOutlineCancel
									size={20}
									className="text-black dark:text-white"
								/>
							</button>
						) : (
							<button
								className="ml-auto text-black dark-text-white hover:opacity-50 hover:animate-pulse"
								onClick={handleOnGroupDelete}
							>
								<MdDeleteForever
									size={20}
									className="text-black dark:text-white"
								/>
							</button>
						)}
					</div>
				)}
			</div>
		)
	} else {
		return null
	}
}

export default memo(Group, (prevProps, nextProps) => {
	return prevProps.activeGroup?.id === nextProps.activeGroup?.id
})
