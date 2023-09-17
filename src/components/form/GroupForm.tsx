import React, { useCallback, useState, useMemo, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { nanoid } from "nanoid"

import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import {
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	useDroppable,
	useSensor,
	useSensors,
} from "@dnd-kit/core"

import { addGroup, deleteGroup, editGroupTitle, setBookmarkGroups } from "../../redux/features/bookmarkSlice"

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

	const { setNodeRef } = useDroppable({ id: "groups" })

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

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				delay: 85,
				tolerance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 85,
				tolerance: 5,
			},
		})
	)

	const handleDragStart = (event: DragEndEvent) => {
		const { active } = event
		const { id } = active

		setActiveGroup(bookmarkData.find((group) => group.id === id))
	}

	const handleDragEnd = (event: DragEndEvent) => {
		setActiveGroup(undefined)

		const { active, over } = event

		const activeGroupId = active.id
		const overGroupId = over?.id

		if (!activeGroupId || !overGroupId || activeGroupId === overGroupId) {
			return
		}

		const activeGroupIndex = bookmarkData.findIndex((group) => group.id === activeGroupId)
		const overGroupIndex = bookmarkData.findIndex((group) => group.id === overGroupId)

		if (activeGroupIndex === -1 || overGroupIndex === -1 || !activeGroup) {
			return
		}

		const updatedBookmarkGroupsList = [...bookmarkData]
		updatedBookmarkGroupsList.splice(activeGroupIndex, 1)
		updatedBookmarkGroupsList.splice(overGroupIndex, 0, activeGroup)

		dispatch(setBookmarkGroups(updatedBookmarkGroupsList))
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
					<DndContext
						sensors={sensors}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={bookmarkData}
							strategy={rectSortingStrategy}
							disabled={isDragDisabled}
						>
							<div
								ref={setNodeRef}
								className="overflow-y-auto scroll-auto max-h-96 px-3 py-1 rounded-xl"
							>
								{bookmarkData.map((group) => (
									<Group
										key={group.id}
										group={group}
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
						</SortableContext>
					</DndContext>
				)}
			</Dialog>
		</>
	)
}
