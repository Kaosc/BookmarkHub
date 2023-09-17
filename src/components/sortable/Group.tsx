import React, { memo } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useDispatch, useSelector } from "react-redux"

import { moveSelectedBookmarks } from "../../redux/features/bookmarkSlice"

import { RxDragHandleHorizontal } from "react-icons/rx"
import { MdDeleteForever } from "react-icons/md"
import { RiFolderTransferLine } from "react-icons/ri"

import Text from "../ui/Text"
import { toggleSelectionMode } from "../../redux/features/selectionSlice"

function Group({
	group,
	activeGroup,
	handleGroupDelete,
	quitFrom,
}: {
	group: BookmarkData
	activeGroup?: BookmarkData
	handleGroupDelete: (e: React.MouseEvent<HTMLButtonElement>, id: string) => void
	quitFrom: (e: React.MouseEvent<HTMLButtonElement>) => void
}) {
	const dispatch = useDispatch()
	const { selectionMode, selectedBookmarks } = useSelector((state: RootState) => state.selection)

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

	const handleOnGroupDelete = (e: React.MouseEvent<HTMLButtonElement>) => handleGroupDelete(e, group.id)

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
					${activeGroup ? "cursor-grabbing" : "cursor-grab"}
				`}
			>
				<div className="mr-auto flex items-center justify-start">
					{!selectionMode && (
						<RxDragHandleHorizontal
							size={26}
							className={`text-black dark:text-white`}
						/>
					)}
					<Text className="ml-2 truncate max-w-[190px]">{group.title}</Text>
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
		)
	} else {
		return null
	}
}

export default memo(Group, (prevProps, nextProps) => {
	return prevProps.activeGroup?.id === nextProps.activeGroup?.id
})
