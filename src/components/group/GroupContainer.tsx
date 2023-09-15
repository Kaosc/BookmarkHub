import { useState, memo } from "react"
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"

import Bookmark from "../sortable/Bookmark"
import BookmarkForm from "../form/BookmarkForm"
import GroupForm from "../form/GroupForm"
import { useSelector } from "react-redux"
import GroupHeader from "./GroupHeader"

function GroupContainer({ bookmarkData, groupIndex }: { bookmarkData: BookmarkData; groupIndex: number }) {
	const bookmarkGroups = useSelector((state: RootState) => state.bookmarks)

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
			<SortableContext
				id={bookmarkData.id}
				items={bookmarkData?.bookmarks}
				strategy={rectSortingStrategy}
			>
				{/* GROUP HEADER */}
				<div
					ref={setNodeRef}
					className="flex flex-col w-full transition-all ease-in-out"
				>
					<GroupHeader
						bookmarkData={bookmarkData}
						groupIndex={groupIndex}
						handleBookmarkFormVisible={handleBookmarkFormVisible}
						handleGroupFormVisible={handleGroupFormVisible}
						isGroupDefault={isGroupDefault}
						bookmarkGroups={bookmarkGroups}
					/>

					{/* BOOKMARK LISTS */}
					<div className="grid grid-cols-6 px-1">
						{bookmarkData.bookmarks.map((bookmark) => (
							<Bookmark
								key={bookmark.id}
								bookmark={bookmark}
							/>
						))}
					</div>
				</div>
			</SortableContext>
		</>
	)
}

export default memo(GroupContainer)
