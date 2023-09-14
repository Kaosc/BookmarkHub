import { useState, useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
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

import { editGroup } from "../redux/features/bookmarkSlice"

import GroupContainer from "../components/GroupContainer"
import Bookmark from "../components/sortable/Bookmark"

// get scroll event
export default function Home() {
	const bookmarkGroups = useSelector((state: RootState) => state.bookmarks)
	const dispatch = useDispatch()

	const [activeBookmark, setActiveBookmark] = useState<Bookmark>()
	const isScrolling = useRef(false)

	useEffect(() => {
		let timeout: NodeJS.Timeout

		const handleScroll = () => {
			isScrolling.current = true

			// Debounce the scroll end detection
			timeout = setTimeout(() => {
				isScrolling.current = false
			}, 100) // Adjust the debounce delay as needed
		}

		window.addEventListener("scroll", handleScroll)

		return () => {
			window.removeEventListener("scroll", handleScroll)
			clearTimeout(timeout)
		}
	}, [])

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

	const handleDragStart = (event: DragEndEvent) => {
		const { active } = event
		const { id } = active

		setActiveBookmark(
			bookmarkGroups
				.map((group) => group.bookmarks)
				.flat()
				.find((bookmark) => bookmark.id === id)
		)
	}

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event

		// Add a check to prevent unnecessary updates
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

		const updatedOverGroup = {
			...overBookmarkGroup,
			bookmarks: [...overBookmarkGroup.bookmarks, activeBookmarkGroup.bookmarks[activeBookmarkIndex]],
		}

		// if user scrolling while dragging bookmark disable dispatch
		if (isScrolling.current) return

		if (activeBookmarkGroup.id !== overBookmarkGroup.id) {
			dispatch(
				editGroup({
					id: activeBookmarkGroupId,
					title: updatedActiveGroup.title,
					bookmarks: updatedActiveGroup.bookmarks,
				})
			)

			dispatch(
				editGroup({
					id: overBookmarkGroupId,
					title: updatedOverGroup.title,
					bookmarks: updatedOverGroup.bookmarks,
				})
			)
		}
	}

	const handleDragEnd = (event: DragEndEvent) => {
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
	}

	return (
		<main className="overflow-y-auto bg-gradient-to-r from-[#0e0e0e] to-zinc-950">
			<DndContext
				sensors={sensors}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDragOver={handleDragOver}
			>
				{bookmarkGroups.map((bookmarkData) => (
					<GroupContainer
						key={bookmarkData.id+bookmarkData.title}
						bookmarkData={bookmarkData}
					/>
				))}
				<DragOverlay
					transition={undefined}
					adjustScale={false}
				>
					{activeBookmark ? (
						<Bookmark
							key={"activeBookmark"}
							opacity="opacity-50"
							bookmark={activeBookmark}
						/>
					) : null}
				</DragOverlay>
			</DndContext>
		</main>
	)
}
