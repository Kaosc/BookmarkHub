import { memo } from "react"
import { AiFillEdit } from "react-icons/ai"

import { useSortable } from "@dnd-kit/sortable"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

import { useDispatch } from "react-redux"
import { setFormBookmark, toggleForm } from "../redux/features/formSlice"

function Bookmark({
	group,
	bookmark,
	opacity = "opacity-100",
}: {
	group?: GroupInfo
	bookmark: Bookmark
	opacity?: string
}) {
	const { id, title, url, favicon } = bookmark
	const { isDragging } = useDraggable({ id: id })
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id })

	const dispatch = useDispatch()

	const editBookmark = () => {
		dispatch(setFormBookmark(bookmark))
		if (group) dispatch(toggleForm({ group: { id: group?.id, title: group?.title }, mode: "editBookmark" }))
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
			className={`group relative flex flex-col items-center justify-center hover:bg-zinc-900 p-1 w-[70px] my-3 mx-[1px] transition-all duration-300 ${opacity}`}
		>
			<div
				className={`absolute flex invisible top-0 left-0 justify-end w-full group-hover:visible transition-all duration-300 z-10`}
			>
				<button
					onClick={editBookmark}
					className="p-1 text-white rounded-full hover:bg-gray-600 transition-all duration-300"
				>
					<AiFillEdit size={13} />
				</button>
			</div>

			<a
				href={isDragging ? " " : url}
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
				<p className="text-xs text-center text-white text-clip line-clamp-1 w-[60px]">{title}</p>
			</a>
		</div>
	)
}

export default memo(Bookmark)
