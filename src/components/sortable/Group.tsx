import React, { memo } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { RxDragHandleHorizontal } from "react-icons/rx"
import { CSS } from "@dnd-kit/utilities"
import { MdDeleteForever } from "react-icons/md"

function Group({
	group,
	activeGroup,
	handleGroupDelete,
}: {
	group: BookmarkData
	activeGroup?: BookmarkData
	handleGroupDelete: (e: React.MouseEvent<HTMLButtonElement>, id: string) => void
}) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: group.id })
	const style = {
		transform: CSS.Transform.toString({
			y: transform?.y ?? 0,
			x: 0,
			scaleX: transform?.scaleX ?? 1,
			scaleY: transform?.scaleY ?? 1,
		}),
		transition,
	}

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => handleGroupDelete(e, group.id)

	if (group.id !== "default") {
		return (
			<div
				ref={setNodeRef}
				style={style}
				{...listeners}
				{...attributes}
				className={`
					flex items-center justify-start w-full p-1 my-2 border border-gray-600 rounded-md 
					${activeGroup?.id === group.id && "bg-zinc-900"} 
					${activeGroup ? "cursor-grabbing" : "cursor-grab"}
				`}
			>
				<div className="mr-auto flex items-center justify-start">
					<RxDragHandleHorizontal
						size={26}
						className={`text-white`}
					/>
					<p className="ml-2 text-white truncate max-w-[190px]">{group.title}</p>
				</div>

				{/* delete */}
				<button
					className="ml-auto text-gray-400 hover:opacity-50 hover:animate-pulse"
					onClick={handleClick}
				>
					<MdDeleteForever size={20} />
				</button>
			</div>
		)
	} else {
		return null
	}
}

export default memo(Group)
