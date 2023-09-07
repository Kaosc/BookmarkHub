import BookmarkForm from "../components/BookmarkForm"
import { useState } from "react"
import { IoIosAdd } from "react-icons/io"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable"
import Bookmark from "./Bookmark"

export default function BookmarkGroupList({ bookmarkData }: { bookmarkData: BookmarkData }) {
	const [formVisible, setFormVisible] = useState(false)

	const { setNodeRef } = useDroppable({
		id: bookmarkData.id,
	})

	const formVisibleHandler = () => {
		setFormVisible((prev) => !prev)
	}

	return (
		<>
			{formVisible && (
				<BookmarkForm
					handleAddButtonClick={formVisibleHandler}
					initGroupId={bookmarkData.id}
				/>
			)}
			<section className="flex flex-col items-center justify-center w-full">
				<div className="flex w-full items-center justify-between px-2 bg-gradient-to-r from-zinc-800 to-zinc-700">
					<h1 className="py-2 text-base font-bold text-center text-white">{bookmarkData.title}</h1>
					<button
						className="flex items-center justify-center hover:opacity-50 hover:animate-pulse"
						onClick={() => formVisibleHandler()}
					>
						<IoIosAdd
							size={30}
							className="text-white"
						/>
					</button>
				</div>
				<SortableContext
					id={bookmarkData.id}
					items={bookmarkData.bookmarks}
					strategy={rectSortingStrategy}
				>
					<div
						ref={setNodeRef}
						className="flex flex-wrap w-full h-44 bg-white"
					>
						{bookmarkData.bookmarks.map((bookmark) => (
							<Bookmark
								key={bookmark.id}
								bookmark={bookmark}
							/>
						))}
					</div>
				</SortableContext>
			</section>
		</>
	)
}
