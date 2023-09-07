import { memo } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { AiFillEdit } from "react-icons/ai"
import { MdDeleteForever } from "react-icons/md"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { removeBookmark } from "../redux/features/bookmarkSlice"
import { setPrevBookmark, toggleForm } from "../redux/features/formSlice"

function Bookmark({
	groupId,
	bookmark,
	opacity = "opacity-100",
}: {
	groupId?: string
	bookmark: Bookmark
	opacity?: string
}) {
	const { id, title, url, favicon } = bookmark
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id })

	const bookmarkGroups = useSelector((state: StoreRootState) => state.bookmarks)
	const dispatch = useDispatch()

	const handleDelete = () => {
		dispatch(removeBookmark({ bookmarkId: bookmark.id, groupId: bookmarkGroups[0].id }))
	}

	const openForm = () => {
		dispatch(toggleForm({ groupId: groupId }))
		dispatch(setPrevBookmark({ prevBookmark: bookmark }))
	}

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className={`group relative flex flex-col items-center justify-center w-[70px] p-1 mx-2 mt-2 transition-all duration-300 ${opacity}`}
		>
			{/* edit icon right delete icon left */}
			<div
				className={`absolute flex invisible top-0 left-0 justify-between w-full group-hover:visible transition-all duration-300 z-10`}
			>
				<button
					onClick={openForm}
					className="p-1 text-white rounded-full hover:bg-gray-600 transition-all duration-300"
				>
					<AiFillEdit size={13} />
				</button>
				<button
					onClick={handleDelete}
					className="p-1 text-white rounded-full hover:bg-gray-600 transition-all duration-300"
				>
					<MdDeleteForever size={13} />
				</button>
			</div>

			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="flex flex-col justify-center items-center  hover:scale-[1.04] transition-all duration-300  hover:animate-pulse"
			>
				<img
					src={favicon}
					alt={title}
					width={32}
					height={32}
					className="mb-[5px]"
				/>
				<p className="text-sm text-center text-white text-ellipsis line-clamp-1 w-16">{title}</p>
			</a>
		</div>
	)
}

export default memo(Bookmark)
