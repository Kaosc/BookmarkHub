import { IoIosAdd } from "react-icons/io"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable"
import Bookmark from "./Bookmark"
import { useDispatch } from "react-redux"
import { toggleForm } from "../redux/features/formSlice"

export default function BookmarkGroupList({ bookmarkData }: { bookmarkData: BookmarkData }) {
	const dispatch = useDispatch()

	const { setNodeRef } = useDroppable({
		id: bookmarkData.id,
	})

	const openForm = () => {
		dispatch(toggleForm({ groupId: bookmarkData.id }))
	}

	return (
		<>
			<SortableContext
				id={bookmarkData.id}
				items={bookmarkData.bookmarks}
				strategy={rectSortingStrategy}
			>
				<div className="flex w-full items-center justify-between px-2 bg-gradient-to-r from-zinc-900 to-zinc-950 transition-all ease-in-out">
					<h1 className="py-2 text-base font-bold text-center text-white">{bookmarkData.title}</h1>
					<button
						className="flex items-center justify-center hover:opacity-50 hover:animate-pulse"
						onClick={openForm}
					>
						<IoIosAdd
							size={30}
							className="text-white"
						/>
					</button>
				</div>
				<div
					ref={setNodeRef}
					className="flex flex-wrap w-full min-h-[100px]"
				>
					{bookmarkData.bookmarks.map((bookmark) => (
						<Bookmark
							key={bookmark.id}
							groupId={bookmarkData.id}
							bookmark={bookmark}
						/>
					))}
				</div>
			</SortableContext>
		</>
	)
}
