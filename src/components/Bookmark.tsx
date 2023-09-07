import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export default function Bookmark({ bookmark }: { bookmark: Bookmark }) {
	const { id, title, url, favicon } = bookmark
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id })

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
			className="flex flex-col items-center justify-center w-16 p-1 mx-2 mt-2 transition-all duration-300"
		>
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="flex flex-col justify-center items-center"
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
