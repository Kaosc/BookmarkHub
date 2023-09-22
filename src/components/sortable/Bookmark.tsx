import { memo, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { LazyLoadImage } from "react-lazy-load-image-component"

import { AiFillEdit } from "react-icons/ai"

import { removeSelectedBookmark, setSelectedBookmarks } from "../../redux/features/selectionSlice"

import Text from "../ui/Text"
import CheckBox from "../ui/CheckBox"
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
	const dispatch = useDispatch()

	const { allowTwoLineTitle, showBookmarksTitle, theme } = useSelector((state: RootState) => state.settings)
	const { selectionMode, selectedBookmarks } = useSelector((state: RootState) => state.selection)

	const { id, title, url, favicon } = bookmark
	const [formVisible, setFormVisible] = useState(false)

	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id })
	const style = { transform: CSS.Transform.toString(transform), transition }

	const isChecked = useMemo(
		() => selectedBookmarks.map((b) => b.id).includes(bookmark.id),
		[selectedBookmarks, bookmark]
	)

	const handleSelectBookmark = () => {
		if (selectedBookmarks.map((b) => b.id).includes(bookmark.id)) {
			dispatch(removeSelectedBookmark(bookmark.id))
			return
		}

		dispatch(setSelectedBookmarks([bookmark]))
	}

	const handleFormVisible = () => setFormVisible((prev) => !prev)

	const redirect = () => {
		if (url) {
			try {
				if (!url.startsWith("https")) {
					window.open(`https://${url}`, "_blank")
				} else {
					window.open(url, "_blank")
				}
			} catch (e) {
				notify("Url is invalid", theme)
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
					group relative flex flex-col items-center justify-center hover:dark:bg-zinc-900 hover:bg-[#cacaca]
					p-1 w-[70px] my-2 mx-[1px] transition-all ${opacity}
					transition-all duration-500 ease-out animate-in fade-in-0 ${className}
					${isChecked ? "dark:bg-[#3a3a3a] bg-[#cfcfcf]" : ""}
				`}
			>
				{selectionMode ? (
					<div className={`absolute flex top-0 right-0 justify-end group-hover:visible z-10`}>
						<CheckBox
							onChange={handleSelectBookmark}
							checked={isChecked}
						/>
					</div>
				) : (
					<div className={`absolute flex invisible top-0 right-0 justify-end group-hover:visible z-10`}>
						<button
							onClick={handleFormVisible}
							className="p-[3px] rounded-full themed dark:hover:bg-[#acacac] hover:bg-[#6b696d] hover:text-white dark:hover:text-black transition-all"
						>
							<AiFillEdit size={13} />
						</button>
					</div>
				)}

				<button
					onClick={selectionMode ? handleSelectBookmark : redirect}
					className="flex flex-col justify-center items-center hover:scale-[1.04] transition-all hover:animate-pulse"
				>
					<LazyLoadImage
						src={favicon}
						alt="favicon"
						sizes="29px"
						width={29}
						height={29}
						className={`mb-[5px]`}
					/>
					{showBookmarksTitle && (
						<Text
							className={`text-[11px] text-center max-w-[57px] ${
								allowTwoLineTitle ? "line-clamp-2" : "truncate"
							}`}
						>
							{title}
						</Text>
					)}
				</button>
			</div>
		</>
	)
}

export default memo(Bookmark, (prevProps, nextProps) => {
	return (
		prevProps.bookmark === nextProps.bookmark &&
		prevProps.opacity === nextProps.opacity &&
		prevProps.className === nextProps.className
	)
})
