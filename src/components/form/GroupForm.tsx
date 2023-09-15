import React, { useCallback, useState } from "react"
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

export default function GroupForm({
	editMode,
	prevGroup,
	handleFormVisible,
}: {
	editMode?: React.RefObject<boolean>
	prevGroup?: GroupInfo
	handleFormVisible: Function
}) {
	const bookmarkData = useSelector((state: RootState) => state.bookmarks)
	const dispatch = useDispatch()

	const [group, setGroup] = useState(prevGroup || { id: "default", title: "" })
	const [activeGroup, setActiveGroup] = useState<BookmarkData>()

	const { setNodeRef } = useDroppable({ id: "groups" })

	const quitFrom = useCallback(
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

	const handleGroupEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		dispatch(editGroupTitle({ id: group.id, title: group.title }))
		quitFrom(e)
	}

	const handleGroupAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		dispatch(addGroup({ id: nanoid(), title: group.title, bookmarks: [] }))
		quitFrom(e)
	}

	const handleGroupDelete = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>, groupId?: string) => {
			e.preventDefault()
			dispatch(deleteGroup(groupId || group.id))
			if (!groupId) quitFrom(e)
		},
		[group, dispatch, quitFrom]
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
		<Dialog
			onClose={quitFrom}
			title={editMode?.current ? "Reorder Groups" : prevGroup ? "Edit Group" : "Add Group"}
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
						handleDelete={handleGroupDelete}
						handleCancel={quitFrom}
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
									handleGroupDelete={handleGroupDelete}
								/>
							))}
						</div>
					</SortableContext>
				</DndContext>
			)}
		</Dialog>
	)
}
