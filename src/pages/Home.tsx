import { useState, useCallback, useRef, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useScrolling } from "react-use"
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
	pointerWithin,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { debounce } from "lodash"

import { editGroup, setBookmarkGroups } from "../redux/features/bookmarkSlice"

import GroupContainer from "../components/group/GroupContainer"
import Bookmark from "../components/sortable/Bookmark"

export default function Home() {
	const bookmarkGroups = useSelector((state: RootState) => state.bookmarks)
	const search = useSelector((state: RootState) => state.search)
	const dispatch = useDispatch()

	const [activeBookmark, setActiveBookmark] = useState<Bookmark>()

	const scrollRef = useRef<HTMLDivElement>(null)
	const scrolling = useScrolling(scrollRef)

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
		})
	)

	const handleDragStart = useCallback(
		(event: DragEndEvent) => {
			const { active } = event
			const { id } = active

			setActiveBookmark(
				bookmarkGroups
					.map((group) => group.bookmarks)
					.flat()
					.find((bookmark) => bookmark.id === id)
			)
		},
		[bookmarkGroups]
	)

	const debouncedHandleDragOver = debounce((event) => {
		handleDragOver(event)
	}, 10)

	const handleDragOver = useCallback(
		(event: DragOverEvent) => {
			if (scrolling) return

			const { active, over } = event

			if (!active || !over || active.id === over.id) {
				return
			}

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
				(bookmark) => bookmark.id === activeBookmarkId
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

			// change the groupId of the bookmark
			const updatedBookmark = {
				...activeBookmarkGroup.bookmarks[activeBookmarkIndex],
				groupId: overBookmarkGroupId,
			}

			const updatedOverGroup = {
				...overBookmarkGroup,
				bookmarks: [...overBookmarkGroup.bookmarks, updatedBookmark],
			}

			if (activeBookmarkGroup.id !== overBookmarkGroup.id) {
				dispatch(
					setBookmarkGroups(
						bookmarkGroups.map((group) => {
							if (group.id === activeBookmarkGroupId) {
								return updatedActiveGroup
							} else if (group.id === overBookmarkGroupId) {
								return updatedOverGroup
							} else {
								return group
							}
						})
					)
				)
			}
		},
		[bookmarkGroups, dispatch, scrolling]
	)

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			if (scrolling) return

			const { active, over } = event

			if (!active) {
				return
			}

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
					})
				)
			}

			setActiveBookmark(undefined)
		},
		[bookmarkGroups, dispatch, scrolling]
	)

	return (
		<DndContext
			sensors={sensors}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragOver={debouncedHandleDragOver}
			collisionDetection={pointerWithin}
		>
			<main
				overflow-y-auto
				scroll-auto
				bg-gradient-to-r
				className={`overflow-y-auto scroll-auto bg-gradient-to-r from-zinc-200 to-zinc-50 dark:from-[#0e0e0e] dark:to-zinc-950 ${
					search && "hidden"
				}`}
				ref={scrollRef}
			>
				{bookmarkGroups.length === 1 && !bookmarkGroups[0].bookmarks.length ? (
					<div className="flex items-center justify-center h-screen">
						<img
							src="assets/kitty-dark.png"
							alt="empty"
							className="w-1/2 opacity-100 dark:opacity-40"
						/>
					</div>
				) : (
					bookmarkGroups.map((bookmarkData, index) => (
						<GroupContainer
							groupIndex={index}
							key={bookmarkData.id}
							bookmarkData={bookmarkData}
						/>
					))
				)}
				<DragOverlay>
					{activeBookmark ? (
						<Bookmark
							key={activeBookmark.id + "overlay"}
							opacity="opacity-50"
							bookmark={activeBookmark}
						/>
					) : null}
				</DragOverlay>
			</main>
		</DndContext>
	)
}
