import { memo, useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { AiFillEdit } from "react-icons/ai"

import BookmarkForm from "../form/BookmarkForm"
import { notify } from "../../utils/notify"

function Bookmark({
	bookmark,
	opacity = "opacity-100",
	className,
}: {
	bookmark: Bookmark
	opacity?: string
	className?: React.HTMLAttributes<HTMLDivElement>["className"]
}) {
	const { id, title, url, favicon } = bookmark

	const [formVisible, setFormVisible] = useState(false)

	// dnd-kit
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id })
	const style = { transform: CSS.Transform.toString(transform), transition }

	const handleFormVisible = () => setFormVisible((prev) => !prev)

	const redirect = () => {
		if (url) {
			try {
				if (!url.startsWith("https")) {
					window.open(`https://${url}`, "_blank")
					return
				} else {
					window.open(url, "_blank")
				}
			} catch (e) {
				notify("Url is invalid")
			}
		}
	}

	return (
		<>
			{formVisible && (
				<BookmarkForm
					bookmark={bookmark}
					handleFormVisible={handleFormVisible}
				/>
			)}
			<div
				ref={setNodeRef}
				style={style}
				{...listeners}
				{...attributes}
				className={`
					group relative flex flex-col items-center justify-center hover:bg-zinc-900 
					p-1 w-[70px] my-2 mx-[1px] transition-all ${opacity}
					transition-all duration-500 ease-out animate-in fade-in-0 ${className}
				`}
			>
				<div className={`absolute flex invisible top-0 right-0 justify-end group-hover:visible z-10`}>
					<button
						onClick={handleFormVisible}
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
						width={29}
						height={29}
						className={`mb-[5px]`}
					/>
					<p className="text-[11px] text-center text-white truncate max-w-[57px]">{title}</p>
				</button>
			</div>
		</>
	)
}

export default memo(Bookmark)
