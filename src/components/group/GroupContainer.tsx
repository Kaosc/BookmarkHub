import { useState, useMemo, memo } from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, rectSortingStrategy, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSelector } from "react-redux"

import BookmarkForm from "../form/BookmarkForm"
import GroupForm from "../form/GroupForm"

import Bookmark from "../sortable/Bookmark"
import GroupHeader from "./GroupHeader"

function GroupContainer({ bookmarkData, groupIndex }: { bookmarkData: BookmarkData; groupIndex: number }) {
	const { selectionMode } = useSelector((state: RootState) => state.selection)
	const { headlineView } = useSelector((state: RootState) => state.settings)
	const isGroupDefault = useMemo(() => bookmarkData.id === "default", [bookmarkData.id])

	const [bookmarkFormVisible, setBookmarkFormVisible] = useState(false)
	const [groupFormVisible, setGroupFormVisible] = useState(false)

	const { setNodeRef } = useDroppable({ id: bookmarkData.id })

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
			<SortableContext
				id={bookmarkData.id}
				items={bookmarkData?.bookmarks}
				strategy={headlineView ? verticalListSortingStrategy : rectSortingStrategy}
				disabled={selectionMode}
			>
				<div
					ref={setNodeRef}
					className={`px-1 ${bookmarkData.bookmarks.length > 0 ? "" : "min-h-[20px]"}`}
				>
					{headlineView ? (
						<div className="flex flex-row items-start gap-2">
							{headlineColumns.map((column, colIndex) => (
								<div
									key={colIndex}
									className="flex flex-col items-start flex-1 min-w-0"
								>
									{column.map((bookmark) => (
										<Bookmark
											key={bookmark.id}
											bookmark={bookmark}
										/>
									))}
								</div>
							))}
						</div>
					) : (
						<div className="grid grid-cols-6">
							{bookmarkData.bookmarks.map((bookmark) => (
								<Bookmark
									key={bookmark.id}
									bookmark={bookmark}
								/>
							))}
						</div>
					)}
				</div>
			</SortableContext>
		</>
	)
}

export default memo(GroupContainer, (prevProps, nextProps) => {
	return prevProps.bookmarkData === nextProps.bookmarkData && prevProps.groupIndex === nextProps.groupIndex
})
