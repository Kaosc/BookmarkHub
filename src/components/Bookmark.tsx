import { memo } from "react"
import { AiFillEdit } from "react-icons/ai"

import { useSortable } from "@dnd-kit/sortable"
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
	const dispatch = useDispatch()

	const { id, title, url, favicon } = bookmark
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	const editBookmark = () => {
		dispatch(setFormBookmark(bookmark))
		if (group) dispatch(toggleForm({ initGroup: { id: group?.id, title: group?.title }, mode: "editBookmark" }))
	}

	const redirect = () => {
		if (url) window.open(url, "_blank")
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className={`group relative flex flex-col items-center justify-center hover:bg-zinc-900 p-1 w-[70px] my-3 mx-[1px] transition-all ${opacity}`}
		>
			<div className={`absolute flex invisible top-0 left-0 justify-end w-full group-hover:visible z-10`}>
				<button
					onClick={editBookmark}
					className="p-1 text-white rounded-full hover:bg-gray-600 transition-all"
				>
					<AiFillEdit size={13} />
				</button>
			</div>

			<button
				onClick={redirect}
				className="flex flex-col justify-center items-center hover:scale-[1.04] transition-all hover:animate-pulse"
			>
				<img
					src={favicon}
					alt={title}
					width={32}
					height={32}
					className="mb-[5px]"
				/>
				<p className="text-xs text-center text-white text-clip line-clamp-1 w-[60px]">{title}</p>
			</button>
		</div>
	)
}

export default memo(Bookmark)
