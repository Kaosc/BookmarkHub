import { useState, memo } from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable"
import { useSelector } from "react-redux"

import BookmarkForm from "../form/BookmarkForm"
import GroupForm from "../form/GroupForm"

import Bookmark from "../sortable/Bookmark"
import GroupHeader from "./GroupHeader"

function GroupContainer({ bookmarkData, groupIndex }: { bookmarkData: BookmarkData; groupIndex: number }) {
	const { selectionMode } = useSelector((state: RootState) => state.selection)
	const isGroupDefault = bookmarkData.id === "default"

	const [bookmarkFormVisible, setBookmarkFormVisible] = useState(false)
	const [groupFormVisible, setGroupFormVisible] = useState(false)

	const { setNodeRef } = useDroppable({ id: bookmarkData.id })

	const handleBookmarkFormVisible = () => setBookmarkFormVisible((prev) => !prev)
	const handleGroupFormVisible = () => setGroupFormVisible((prev) => !prev)

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
				strategy={rectSortingStrategy}
				disabled={selectionMode}
			>
				<div
					ref={setNodeRef}
					className={`grid grid-cols-6 px-1 ${bookmarkData.bookmarks.length > 0 ? "" : "min-h-[20px]"}`}
				>
					{bookmarkData.bookmarks.map((bookmark) => (
						<Bookmark
							key={bookmark.id}
							bookmark={bookmark}
						/>
					))}
				</div>
			</SortableContext>
		</>
	)
}

export default memo(GroupContainer, (prevProps, nextProps) => {
	return prevProps.bookmarkData === nextProps.bookmarkData && prevProps.groupIndex === nextProps.groupIndex
})
