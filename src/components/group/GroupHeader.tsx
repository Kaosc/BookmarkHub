import React, { memo } from "react"
import { useDispatch } from "react-redux"
import { arrayMove } from "@dnd-kit/sortable"

import { AiFillEdit, AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai"
import { IoIosAdd } from "react-icons/io"

import { setBookmarkGroups } from "../../redux/features/bookmarkSlice"

function GroupHeader({
	bookmarkData,
	groupIndex,
	handleBookmarkFormVisible,
	handleGroupFormVisible,
	isGroupDefault,
	bookmarkGroups,
}: {
	bookmarkData: BookmarkData
	groupIndex: number
	handleBookmarkFormVisible: React.MouseEventHandler<HTMLButtonElement>
	handleGroupFormVisible: React.MouseEventHandler<HTMLButtonElement>
	isGroupDefault: boolean
	bookmarkGroups: BookmarkData[]
}) {
	const dispatch = useDispatch()

	const moveGroupTo = (to: string) => {
		const toIndex = to === "up" ? -1 : 1
		const newBookmarkGroups = arrayMove(bookmarkGroups, groupIndex, groupIndex + toIndex)
		dispatch(setBookmarkGroups(newBookmarkGroups))
	}

	const buttonStyle = "flex items-center justify-center hover:opacity-50 hover:animate-pulse"

	return (
		<div
			className={`
      flex items-center justify-between mx-2 px-2 py-[2px] my-2
      rounded-full bg-[#1B1B1C]
      transition-all ease-in-out shadow-lg shadow-[rgba(0, 0, 0, 0.603)]
      ${bookmarkData?.id === "default" && bookmarkData?.bookmarks?.length > 0 ? "invisible" : "visible"}
      ${bookmarkData?.id === "default" ? "opacity-0" : ""}
      ${bookmarkData?.id === "default" && bookmarkData?.bookmarks?.length > 0 ? "hidden" : "block"}
   `}
		>
			{/* TITLE */}
			<h1 className="pl-2 text-[13.5px] font-semibold text-center text-zinc-200 truncate max-w-xs">
				{bookmarkData?.title === "default" ? "Bookmark Hub" : bookmarkData?.title}
			</h1>

			{/* BUTTONS */}
			<div className="flex items-center justify-between">
				{/* MOVE UP & DOWN BUTTONS */}
				{groupIndex !== 1 && (
					<button
						className={buttonStyle}
						onClick={() => moveGroupTo("up")}
						title="Move Group Up"
					>
						<AiOutlineArrowUp
							size={17}
							className="text-white"
						/>
					</button>
				)}
				{groupIndex !== bookmarkGroups.length - 1 && (
					<button
						className={buttonStyle}
						onClick={() => moveGroupTo("down")}
						title="Move Group Down"
					>
						<AiOutlineArrowDown
							size={17}
							className="text-white mr-[2px]"
						/>
					</button>
				)}

				{/* EDIT GROUP BUTTON */}
				{!isGroupDefault && (
					<button
						className={buttonStyle}
						onClick={handleGroupFormVisible}
						title="Edit Group"
					>
						<AiFillEdit
							size={17}
							className="text-white mr-[1px]"
						/>
					</button>
				)}

				{/* ADD BOOKMARK BUTTON */}
				<button
					className={buttonStyle}
					onClick={handleBookmarkFormVisible}
					title="Add Bookmark to this Group"
				>
					<IoIosAdd
						size={26}
						className="text-white"
					/>
				</button>
			</div>
		</div>
	)
}

export default memo(GroupHeader)
