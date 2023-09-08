import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"

import { IoIosAdd } from "react-icons/io"
import { AiFillEdit } from "react-icons/ai"

import { useDispatch } from "react-redux"
import { toggleForm } from "../redux/features/formSlice"

import Bookmark from "./Bookmark"

export default function BookmarkGroupList({ bookmarkData }: { bookmarkData: BookmarkData }) {
	const isGroupDefault = bookmarkData.id === "default"
	const dispatch = useDispatch()

	const { setNodeRef } = useDroppable({
		id: bookmarkData.id,
	})

	const addBookmarkToGroup = () => {
		dispatch(toggleForm({ group: { id: bookmarkData.id, title: bookmarkData.title }, mode: "addBookmark" }))
	}

	const editGroup = () => {
		dispatch(toggleForm({ group: { id: bookmarkData.id, title: bookmarkData.title }, mode: "editGroup" }))
	}

	return (
		<SortableContext
			id={bookmarkData.id}
			items={bookmarkData.bookmarks}
			strategy={rectSortingStrategy}
		>
			<div
				ref={setNodeRef}
				className="flex flex-wrap w-full "
			>
				<div className="flex w-full items-center justify-between px-2 bg-gradient-to-r from-zinc-900 to-zinc-950 transition-all ease-in-out">
					<h1 className="py-2 text-base font-bold text-center text-white">
						{bookmarkData.title === "default" ? "Bookmark Hub" : bookmarkData.title}
					</h1>
					<div className="flex">
						{!isGroupDefault && (
							<button
								className="flex items-center justify-center hover:opacity-50 hover:animate-pulse"
								onClick={editGroup}
							>
								<AiFillEdit
									size={19}
									className="text-white"
								/>
							</button>
						)}
						<button
							className="flex items-center justify-center hover:opacity-50 hover:animate-pulse"
							onClick={addBookmarkToGroup}
						>
							<IoIosAdd
								size={30}
								className="text-white"
							/>
						</button>
					</div>
				</div>
				{bookmarkData.bookmarks.map((bookmark) => (
					<Bookmark
						key={bookmark.id}
						group={{
							id: bookmarkData.id,
							title: bookmarkData.title,
						}}
						bookmark={bookmark}
					/>
				))}
			</div>
		</SortableContext>
	)
}
