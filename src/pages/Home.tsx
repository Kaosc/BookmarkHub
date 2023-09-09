import { useState } from "react"

import {
	DndContext,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	DragOverEvent,
	TouchSensor,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"

import { useSelector, useDispatch } from "react-redux"
import { editGroup } from "../redux/features/bookmarkSlice"

import BookmarkGroupList from "../components/BookmarkGroupList"
import Bookmark from "../components/Bookmark"

export default function Home() {
	const bookmarkGroups = useSelector((state: StoreRootState) => state.bookmarks)
	const dispatch = useDispatch()
	const [activeBookmark, setActiveBookmark] = useState<Bookmark>()

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				delay: 100,
				tolerance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 100,
				tolerance: 5,
			},
		}),
	)

	const handleDragStart = (event: DragEndEvent) => {
		const { active } = event
		const { id } = active

		setActiveBookmark(
			bookmarkGroups
				.map((group) => group.bookmarks)
				.flat()
				.find((bookmark) => bookmark.id === id),
		)
	}

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event

		const activeBookmarkId = active.id
		const activeBookmarkGroupId = active.data.current?.sortable.containerId || activeBookmarkId

		const overBookmarkId = over?.id
		const overBookmarkGroupId = over?.data.current?.sortable.containerId || overBookmarkId

		if (!activeBookmarkId || !overBookmarkId || activeBookmarkGroupId === overBookmarkGroupId) {
			return
		}

		const activeBookmarkGroup = bookmarkGroups.find((group) => group.id === activeBookmarkGroupId)
		const overBookmarkGroup = bookmarkGroups.find((group) => group.id === overBookmarkGroupId)

		if (!overBookmarkGroup || !activeBookmarkGroup) return

		const activeBookmarkIndex = activeBookmarkGroup.bookmarks.findIndex(
			(bookmark) => bookmark.id === activeBookmarkId,
		)

		if (activeBookmarkIndex === -1) {
			return
		}

		const updatedActiveGroup = {
			...activeBookmarkGroup,
			bookmarks: [
				...activeBookmarkGroup.bookmarks.slice(0, activeBookmarkIndex),
				...activeBookmarkGroup.bookmarks.slice(activeBookmarkIndex + 1),
			],
		}

		const updatedOverGroup = {
			...overBookmarkGroup,
			bookmarks: [...overBookmarkGroup.bookmarks, activeBookmarkGroup.bookmarks[activeBookmarkIndex]],
		}

		dispatch(
			editGroup({
				id: activeBookmarkGroupId,
				title: updatedActiveGroup.title,
				bookmarks: updatedActiveGroup.bookmarks,
			}),
		)

		dispatch(
			editGroup({
				id: overBookmarkGroupId,
				title: updatedOverGroup.title,
				bookmarks: updatedOverGroup.bookmarks,
			}),
		)
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

		const activeBookmarkIndex = active.data.current?.sortable.index

		const overBookmarkIndex = over?.data.current?.sortable.index
		const overBookmarkGroupId = over?.data.current?.sortable.containerId
		const overBookmarkGroup = bookmarkGroups.find((group) => group.id === overBookmarkGroupId)

		if (
			!activeBookmarkIndex !== undefined &&
			overBookmarkIndex === undefined &&
			activeBookmarkIndex === overBookmarkIndex
		) {
			return
		}

		if (overBookmarkGroup) {
			const newGroup = arrayMove(overBookmarkGroup.bookmarks, activeBookmarkIndex, overBookmarkIndex)

			dispatch(
				editGroup({
					id: overBookmarkGroupId,
					title: overBookmarkGroup.title,
					bookmarks: newGroup,
				}),
			)
		}

		setActiveBookmark(undefined)
	}

	return (
		<main className="overflow-y-auto">
			<DndContext
				sensors={sensors}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDragOver={handleDragOver}
				autoScroll
			>
				{bookmarkGroups.map((bookmarkData) => (
					<BookmarkGroupList
						key={bookmarkData.id}
						bookmarkData={bookmarkData}
					/>
				))}
				<DragOverlay
					transition={undefined}
					style={{ pointerEvents: "none", animation: "ease-in-out" }}
					className={"absolute"}
					adjustScale={false}
				>
					{activeBookmark ? (
						<Bookmark
							opacity="opacity-50"
							bookmark={activeBookmark}
						/>
					) : null}
				</DragOverlay>
			</DndContext>
		</main>
	)
}
