import React, { useCallback, useState, useMemo, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { nanoid } from "nanoid"

import { CollisionPriority } from "@dnd-kit/abstract"
import {
	DragDropProvider,
	DragEndEvent,
	DragStartEvent,
	useDroppable,
} from "@dnd-kit/react"
import { move } from "@dnd-kit/helpers"

import { addGroup, deleteGroup, editGroupTitle, setBookmarkGroups } from "../../redux/features/bookmarkSlice"
import { makeSensorConfig } from "../../utils/dnd"

import Dialog from "../Dialog"
import FormButtons from "./FormButtons"
import Group from "../sortable/Group"
import Confirmation from "../Confirmation"

export default function GroupForm({
	editMode,
	prevGroup,
	handleFormVisible,
}: {
	editMode?: React.RefObject<boolean>
	prevGroup?: GroupInfo
	handleFormVisible: Function
}) {
	const { selectionMode } = useSelector((state: RootState) => state.selection)
	const bookmarkData = useSelector((state: RootState) => state.bookmarks)
	const dispatch = useDispatch()

	const [group, setGroup] = useState(prevGroup || { id: "default", title: "" })
	const [activeGroup, setActiveGroup] = useState<BookmarkData>()
	const [confirmFormVisible, setConfirmFormVisible] = useState(false)
	const groupIdToDelete = useRef("")

	// The container acts as a drop target so groups can also be reordered by
	// dropping them on the empty space of the list. Collision priority is Low
	// so collisions with the group items themselves always take precedence.
	const { ref: setNodeRef } = useDroppable({
		id: "groups",
		accept: "group",
		collisionPriority: CollisionPriority.Low,
	})

	const formTitle = useMemo(() => {
		if (editMode?.current && !selectionMode) return "Reorder & edit Groups"
		else if (prevGroup) return "Edit Group"
		else if (selectionMode && editMode?.current) return "Select Group to Move"
		else return "Add Group"
	}, [editMode, prevGroup, selectionMode])

	const isDragDisabled = useMemo(() => {
		return bookmarkData.length === 1 || selectionMode
	}, [bookmarkData, selectionMode])

	const quitForm = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			handleFormVisible()
			e.preventDefault()
		},
		[handleFormVisible]
	)

	const handleGroupTitleEdit = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			e.preventDefault()
			setGroup({
				...group,
				title: e.target.value,
			})
		},
		[group]
	)

	const handleConfirmFormVisible = (e?: React.MouseEvent<HTMLButtonElement>, groupId?: string) => {
		if (e) e.preventDefault()

		if (groupId) {
			groupIdToDelete.current = groupId
		} else {
			groupIdToDelete.current = ""
		}

		setConfirmFormVisible((prev) => !prev)
	}

	const handleGroupEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		dispatch(editGroupTitle({ id: group.id, title: group.title }))
		quitForm(e)
	}

	const handleGroupAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		dispatch(addGroup({ id: nanoid(), title: group.title, bookmarks: [] }))
		quitForm(e)
	}

	const handleGroupDelete = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault()
			dispatch(deleteGroup(groupIdToDelete.current || group.id))
			quitForm(e)
		},
		[dispatch, quitForm, group.id]
	)

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()

		if (prevGroup) {
			handleGroupEdit(e)
		} else {
			handleGroupAdd(e)
		}
	}

	/////////////////// DRAG & DROP ///////////////////////
	// The legacy PointerSensor + TouchSensor + KeyboardSensor trio is now a
	// single PointerSensor (keyboard sorting is built into sortables).
	const sensors = makeSensorConfig(85)

	const handleDragStart = (event: DragStartEvent) => {
		const { source } = event.operation
		setActiveGroup(bookmarkData.find((group) => group.id === source?.id))
	}

	const handleDragEnd = (event: DragEndEvent) => {
		setActiveGroup(undefined)

		// A canceled drag reverts the optimistic order automatically
		if (event.canceled) return

		const nextBookmarkGroups = move(bookmarkData, event)
		if (nextBookmarkGroups !== bookmarkData) {
			dispatch(setBookmarkGroups(nextBookmarkGroups))
		}
	}

	return (
		<>
			{confirmFormVisible && (
				<Confirmation
					title="Delete"
					onConfirm={handleGroupDelete}
					onDecline={handleConfirmFormVisible}
					onConfirmText="Delete"
				/>
			)}
			<Dialog
				onClose={quitForm}
				title={formTitle}
				className="z-40 "
			>
				{!editMode?.current ? (
					<form>
						<input
							value={group.title}
							required
							className="input"
							type="text"
							title="Enter the name of the new group"
							placeholder={"Group Title"}
							onChange={handleGroupTitleEdit}
							autoFocus
						/>
						<FormButtons
							value={group.title}
							prevValue={prevGroup?.title}
							handleSubmit={handleSubmit}
							handleDelete={handleConfirmFormVisible}
							handleCancel={quitForm}
						/>
					</form>
				) : (
					<DragDropProvider
						sensors={sensors}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
					>
						{/* Sortables register themselves — no SortableContext needed */}
							<div
								ref={setNodeRef}
								className="overflow-y-auto scroll-auto max-h-96 px-3 py-1 rounded-xl"
							>
								{bookmarkData.map((group, index) => (
									<Group
										key={group.id}
										group={group}
										index={index}
										isDragDisabled={isDragDisabled}
										activeGroup={activeGroup}
										quitFrom={quitForm}
										handleConfirmFormVisible={handleConfirmFormVisible}
									/>
								))}

								{bookmarkData.length === 1 && (
									<div className="flex items-center justify-center w-full h-full">
										<p className="text-gray-500 text-sm">No group found</p>
									</div>
								)}
							</div>
					</DragDropProvider>
				)}
			</Dialog>
		</>
	)
}
