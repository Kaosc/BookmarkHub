import { useState, useMemo, memo } from "react"
import { CollisionPriority } from "@dnd-kit/abstract"
import { useDroppable } from "@dnd-kit/react"
import { useSelector } from "react-redux"

import BookmarkForm from "../form/BookmarkForm"
import GroupForm from "../form/GroupForm"

import Bookmark from "../sortable/Bookmark"
import GroupHeader from "./GroupHeader"

function GroupContainer({ bookmarkData, groupIndex }: { bookmarkData: BookmarkData; groupIndex: number }) {
	const { headlineView } = useSelector((state: RootState) => state.settings)
	const isGroupDefault = useMemo(() => bookmarkData.id === "default", [bookmarkData.id])

	const [bookmarkFormVisible, setBookmarkFormVisible] = useState(false)
	const [groupFormVisible, setGroupFormVisible] = useState(false)

	// The group container acts as a drop target so bookmarks can also be
	// moved to empty groups (or the empty space around them). Collision
	// priority is Low so bookmark collisions always take precedence.
	const { ref: setNodeRef } = useDroppable({
		id: bookmarkData.id,
		accept: "bookmark",
		collisionPriority: CollisionPriority.Low,
	})

	const handleBookmarkFormVisible = () => setBookmarkFormVisible((prev) => !prev)
	const handleGroupFormVisible = () => setGroupFormVisible((prev) => !prev)

	// Headline view: fill the LEFT column first, then the right one.
	// CSS columns balance by height (can put more on the right), so split manually.
	const headlineColumns = useMemo(() => {
		if (!headlineView) return [[], []] as [Bookmark[], Bookmark[]]
		const mid = Math.ceil(bookmarkData.bookmarks.length / 2)
		return [
			bookmarkData.bookmarks.slice(0, mid),
			bookmarkData.bookmarks.slice(mid),
		] as [Bookmark[], Bookmark[]]
	}, [headlineView, bookmarkData.bookmarks])

	return (
		<>
			{bookmarkFormVisible && (
				<BookmarkForm
					initGroupToAdd={{
						id: bookmarkData.id,
						title: bookmarkData.title,
					}}
					handleFormVisible={handleBookmarkFormVisible}
				/>
			)}
			{groupFormVisible && (
				<GroupForm
					prevGroup={{ id: bookmarkData.id, title: bookmarkData.title }}
					handleFormVisible={handleGroupFormVisible}
				/>
			)}
			{/* GROUP HEADER */}
			<GroupHeader
				bookmarkData={bookmarkData}
				groupIndex={groupIndex}
				handleBookmarkFormVisible={handleBookmarkFormVisible}
				handleGroupFormVisible={handleGroupFormVisible}
				isGroupDefault={isGroupDefault}
			/>
			{/* Sortables register themselves — no SortableContext needed */}
				<div
					ref={setNodeRef}
					className={`px-1 ${bookmarkData.bookmarks.length > 0 ? "" : "min-h-[20px]"}`}
				>
					{headlineView ? (
						<div className="flex flex-row items-start gap-2">
							{headlineColumns.map((column, colIndex) => {
								const columnOffset = colIndex === 0 ? 0 : headlineColumns[0].length
								return (
									<div
										key={colIndex}
										className="flex flex-col items-start flex-1 min-w-0"
									>
										{column.map((bookmark, bookmarkIndex) => (
											<Bookmark
												key={bookmark.id}
												bookmark={bookmark}
												index={columnOffset + bookmarkIndex}
											/>
										))}
									</div>
								)
							})}
						</div>
					) : (
						<div className="grid grid-cols-6 items-start gap-y-1">
							{bookmarkData.bookmarks.map((bookmark, bookmarkIndex) => (
								<Bookmark
									key={bookmark.id}
									bookmark={bookmark}
									index={bookmarkIndex}
								/>
							))}
						</div>
					)}
				</div>
		</>
	)
}

export default memo(GroupContainer, (prevProps, nextProps) => {
	return prevProps.bookmarkData === nextProps.bookmarkData && prevProps.groupIndex === nextProps.groupIndex
})
