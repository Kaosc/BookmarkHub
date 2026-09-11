import { useCallback, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { UniqueIdentifier } from "@dnd-kit/abstract"
import {
	DragDropProvider,
	DragOverlay,
	DragEndEvent,
	DragOverEvent,
} from "@dnd-kit/react"
import { move } from "@dnd-kit/helpers"

import { setBookmarkGroups } from "../redux/features/bookmarkSlice"
import { makeSensorConfig } from "../utils/dnd"

import GroupContainer from "../components/group/GroupContainer"
import Bookmark from "../components/sortable/Bookmark"

export default function Home() {
	const bookmarkGroups = useSelector((state: RootState) => state.bookmarks)
	const search = useSelector((state: RootState) => state.search)
	const dispatch = useDispatch()

	// Snapshot of the bookmark groups taken when a drag starts, used to
	// revert the redux state when a drag is canceled (e.g. Escape).
	const previousGroups = useRef<BookmarkGroups>([])

	const handleDragStart = useCallback(() => {
		previousGroups.current = bookmarkGroups
	}, [bookmarkGroups])

	const handleDragOver = useCallback(
		(event: DragOverEvent) => {
			// Fully controlled ordering: the optimistic sorting plugin is
			// disabled on bookmark sortables (it re-parents DOM nodes behind
			// React's back, crashing on removeChild and duplicating items),
			// so the redux state is the single source of truth and React
			// renders the new order on every dragover.
			const items: Record<UniqueIdentifier, Bookmark[]> = {}
			for (const group of bookmarkGroups) {
				items[group.id] = group.bookmarks
			}

			const nextItems = move(items, event)
			if (nextItems === items) return

			dispatch(
				setBookmarkGroups(
					bookmarkGroups.map((group) => {
						const nextBookmarks = nextItems[group.id]
						if (nextBookmarks === group.bookmarks) return group
						return {
							...group,
							// keep the bookmark's groupId in sync when it changes groups
							bookmarks: nextBookmarks.map((bookmark) =>
								bookmark.groupId === group.id ? bookmark : { ...bookmark, groupId: group.id }
							),
						}
					}),
				),
			)
		},
		[bookmarkGroups, dispatch],
	)

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			// Redux was already updated during the drag, so a canceled drag
			// has to restore the snapshot taken in onDragStart.
			if (event.canceled) {
				dispatch(setBookmarkGroups(previousGroups.current))
			}
		},
		[dispatch],
	)

	return (
		<DragDropProvider
			sensors={makeSensorConfig(100)}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
		>
			<main
				className={`overflow-y-auto scroll-auto bg-gradient-to-r from-zinc-200 to-zinc-50 dark:from-[#0e0e0e] dark:to-zinc-950 ${
					search && "hidden"
				}`}
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
					{(source) => {
						const bookmark = bookmarkGroups
							.flatMap((group) => group.bookmarks)
							.find((bookmark) => bookmark.id === source.id)
						return bookmark ? (
							<Bookmark
								key={bookmark.id + "overlay"}
								opacity="opacity-50"
								bookmark={bookmark}
							/>
						) : null
					}}
				</DragOverlay>
			</main>
		</DragDropProvider>
	)
}
