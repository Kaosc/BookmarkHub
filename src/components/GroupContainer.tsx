import { useState } from "react"
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"

import { IoIosAdd } from "react-icons/io"
import { AiFillEdit } from "react-icons/ai"

import Bookmark from "./sortable/Bookmark"
import BookmarkForm from "./form/BookmarkForm"
import GroupForm from "./form/GroupForm"

export default function GroupContainer({ bookmarkData }: { bookmarkData: BookmarkData }) {
	const isGroupDefault = bookmarkData.id === "default"

	const [bookmarkFormVisible, setBookmarkFormVisible] = useState(false)
	const [groupFormVisible, setGroupFormVisible] = useState(false)

	const { setNodeRef } = useDroppable({ id: bookmarkData.id })

	const handleBookmarkFormVisible = () => setBookmarkFormVisible((prev) => !prev)
	const handleGroupFormVisible = () => setGroupFormVisible((prev) => !prev)

	const GroupHeader = () => (
		<div
			className="
			flex w-full items-center justify-between mx-2 px-2 py-[2px] my-2
			rounded-full bg-[#1B1B1C]
			transition-all ease-in-out shadow-lg shadow-[rgba(0, 0, 0, 0.603)]
		"
		>
			{/* TITLE */}
			<h1 className="pl-2 text-[13.5px] font-semibold text-center text-zinc-200 truncate max-w-xs">
				{bookmarkData.title === "default" ? "Bookmark Hub" : bookmarkData.title}
			</h1>

			{/* BUTTONS */}
			<div className="flex">
				{/* EDIT GROUP BUTTON */}
				{!isGroupDefault && (
					<button
						className="flex items-center justify-center hover:opacity-50 hover:animate-pulse"
						onClick={handleGroupFormVisible}
					>
						<AiFillEdit
							size={17}
							className="text-white"
						/>
					</button>
				)}

				{/* ADD BOOKMARK BUTTON */}
				<button
					className="flex items-center justify-center hover:opacity-50 hover:animate-pulse"
					onClick={handleBookmarkFormVisible}
				>
					<IoIosAdd
						size={26}
						className="text-white"
					/>
				</button>
			</div>
		</div>
	)

	return (
		<>
			{bookmarkFormVisible && <BookmarkForm handleFormVisible={handleBookmarkFormVisible} />}
			{groupFormVisible && (
				<GroupForm
					prevGroup={{ id: bookmarkData.id, title: bookmarkData.title }}
					handleFormVisible={handleGroupFormVisible}
				/>
			)}
			<SortableContext
				id={bookmarkData.id}
				items={bookmarkData.bookmarks}
				strategy={rectSortingStrategy}
			>
				<div
					ref={setNodeRef}
					className="flex flex-wrap w-full transition-all ease-in-out"
				>
					{/* GROUP HEADER */}
					{bookmarkData.id !== "default" && <GroupHeader />}

					{/* BOOKMARK LIST */}
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
