import { useState } from "react"
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"

import { IoIosAdd } from "react-icons/io"
import { AiFillEdit } from "react-icons/ai"

import Bookmark from "./sortable/Bookmark"
import BookmarkForm from "./form/BookmarkForm"
import GroupForm from "./form/GroupForm"

export default function BookmarkGroupList({ bookmarkData }: { bookmarkData: BookmarkData }) {
	const isGroupDefault = bookmarkData.id === "default"

	const [bookmarkFormVisible, setBookmarkFormVisible] = useState(false)
	const [groupFormVisible, setGroupFormVisible] = useState(false)

	const { setNodeRef } = useDroppable({ id: bookmarkData.id })

	const handleBookmarkFormVisible = () => setBookmarkFormVisible((prev) => !prev)
	const handleGroupFormVisible = () => setGroupFormVisible((prev) => !prev)

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
					{bookmarkData.id !== "default" && (
						<div
							className="
								flex w-full items-center justify-between mx-3 px-1 my-2
								border-b-[1px] border-zinc-600
								transition-all ease-in-out 
							"
						>
							<h1 className="py-2 text-sm font-bold text-center text-zinc-200 truncate max-w-xs">
								{bookmarkData.title === "default" ? "Bookmark Hub" : bookmarkData.title}
							</h1>

							<div className="flex">
								{!isGroupDefault && (
									<button
										className="flex items-center justify-center hover:opacity-50 hover:animate-pulse"
										onClick={handleGroupFormVisible}
									>
										<AiFillEdit
											size={19}
											className="text-white"
										/>
									</button>
								)}
								<button
									className="flex items-center justify-center hover:opacity-50 hover:animate-pulse"
									onClick={handleBookmarkFormVisible}
								>
									<IoIosAdd
										size={30}
										className="text-white"
									/>
								</button>
							</div>
						</div>
					)}

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
