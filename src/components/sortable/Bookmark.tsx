import { memo, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSortable } from "@dnd-kit/react/sortable"
import { OptimisticSortingPlugin } from "@dnd-kit/dom/sortable"
import { LazyLoadImage } from "react-lazy-load-image-component"

import { AiFillEdit } from "react-icons/ai"

import { removeSelectedBookmark, setSelectedBookmarks } from "../../redux/features/selectionSlice"

import Text from "../ui/Text"
import CheckBox from "../ui/CheckBox"
import BookmarkForm from "../form/BookmarkForm"
import { notify } from "../../utils/notify"

function Bookmark({
	bookmark,
	index = 0,
	opacity = "opacity-100",
	className,
}: {
	bookmark: Bookmark
	// position of this bookmark within its group (used by the sortable)
	index?: number
	opacity?: string
	className?: React.HTMLAttributes<HTMLDivElement>["className"]
}) {
	const dispatch = useDispatch()

	const { allowTwoLineTitle, showBookmarksTitle, headlineView, theme } = useSelector((state: RootState) => state.settings)
	const { selectionMode, selectedBookmarks } = useSelector((state: RootState) => state.selection)

	const { title, url, favicon } = bookmark
	const [formVisible, setFormVisible] = useState(false)

	// Sortable item: it coordinates with the DragDropProvider automatically.
	// The legacy `containerId` is replaced by the `group` option, and the
	// library applies drag transforms internally (no manual CSS needed).
	//
	// The OptimisticSortingPlugin is disabled on purpose: it physically
	// re-parents DOM nodes between group containers while dragging, which
	// fights with React's ownership of the DOM and crashes with
	// "Failed to execute 'removeChild'" when the groups re-render (it also
	// duplicates bookmarks because it keeps operating on stale instances
	// after React remounts the bookmark in the other group). Without it,
	// the order is fully controlled by redux in Home's onDragOver instead.
	const { ref: setNodeRef } = useSortable({
		id: bookmark.id,
		index,
		group: bookmark.groupId,
		type: "bookmark",
		accept: "bookmark",
		disabled: selectionMode,
		plugins: (defaults) => defaults.filter((plugin) => plugin !== OptimisticSortingPlugin),
	})
	const isChecked = useMemo(() => selectedBookmarks.map((b) => b.id).includes(bookmark.id), [selectedBookmarks, bookmark])

	const handleSelectBookmark = () => {
		if (selectedBookmarks.map((b) => b.id).includes(bookmark.id)) {
			dispatch(removeSelectedBookmark(bookmark.id))
			return
		}

		dispatch(setSelectedBookmarks([bookmark]))
	}

	const handleFormVisible = () => setFormVisible((prev) => !prev)

	const handleNativeDragStart = (e: React.DragEvent<HTMLDivElement>) => {
		// Block the browser's native image/text drag: it cancels the pointer
		// events dnd-kit needs and makes dragging "not work" in modern Chrome.
		e.preventDefault()
	}

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
				onDragStart={handleNativeDragStart}
				className={`
					group draggable relative flex ${
						headlineView
							? "flex-row items-center w-full break-inside-avoid my-[3px] px-1 py-[4px] rounded-md"
							: "flex-col items-center justify-start w-[70px] shrink-0 py-1"
					} hover:dark:bg-zinc-900 hover:bg-[#cacaca] transition-all duration-500 ease-out animate-in fade-in-0 ${opacity} ${className} ${
						isChecked ? "dark:bg-[#3a3a3a] bg-[#cfcfcf]" : ""
					}
				`}
			>
				<button
					onClick={selectionMode ? handleSelectBookmark : redirect}
					className={`flex transition-all ${
						headlineView
							? "flex-row items-center ml-1 w-full min-w-0 text-left hover:opacity-70"
							: "mx-[1px] w-full py-2 px-1 flex-col justify-start items-center hover:scale-[1.04] hover:animate-pulse"
					}`}
				>
					{headlineView ? (
						<>
							<div className="w-[18px] h-[18px] mr-[10px] shrink-0">
								<LazyLoadImage
									src={favicon}
									alt="favicon"
									sizes="18px"
									width={18}
									height={18}
								/>
							</div>
							{showBookmarksTitle && <Text className="text-[14px] text-left truncate flex-1 min-w-0">{title}</Text>}
						</>
					) : (
						<>
							<div className="flex items-center justify-center w-[29px] h-[29px] mb-[6px] shrink-0">
								<LazyLoadImage
									src={favicon}
									alt="favicon"
									sizes="29px"
									width={29}
									height={29}
								/>
							</div>
							{showBookmarksTitle && (
								<div
									className={`flex justify-center w-full ${
										allowTwoLineTitle ? "min-h-[28px]" : "min-h-[16px]"
									}`}
								>
									<Text
										className={`text-[11px] text-center max-w-[57px] leading-[14px] break-words ${
											allowTwoLineTitle ? "line-clamp-2" : "truncate block"
										}`}
									>
										{title}
									</Text>
								</div>
							)}
						</>
					)}
				</button>
				{selectionMode ? (
					<div
						className={`flex justify-end group-hover:visible z-10 ${
							headlineView ? "ml-auto p-[1px]" : "absolute top-0 right-0 p-[1px]"
						}`}
					>
						<CheckBox
							onChange={handleSelectBookmark}
							checked={isChecked}
						/>
					</div>
				) : (
					<div
						className={`flex justify-end invisible group-hover:visible z-10 ${
							headlineView ? "ml-auto p-[2px]" : "absolute top-0 right-0"
						}`}
					>
						<button
							onClick={handleFormVisible}
							className="p-[4px] rounded-full themed dark:hover:bg-[#acacac] hover:bg-[#6b696d] hover:text-white dark:hover:text-black transition-all"
						>
							<AiFillEdit size={13} />
						</button>
					</div>
				)}
			</div>
		</>
	)
}

export default memo(Bookmark, (prevProps, nextProps) => {
	return (
		prevProps.bookmark === nextProps.bookmark &&
		prevProps.index === nextProps.index &&
		prevProps.opacity === nextProps.opacity &&
		prevProps.className === nextProps.className
	)
})
