import React, { memo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { arrayMove } from "@dnd-kit/sortable"

import { AiFillEdit, AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai"
import { IoIosAdd } from "react-icons/io"

import { removeSelectedBookmarksWithIDs, setSelectedBookmarks } from "../../redux/features/selectionSlice"
import { setBookmarkGroups } from "../../redux/features/bookmarkSlice"

import Text from "../ui/Text"
import CheckBox from "../ui/CheckBox"

function GroupHeader({
	bookmarkData,
	groupIndex,
	handleBookmarkFormVisible,
	handleGroupFormVisible,
	isGroupDefault,
}: {
	bookmarkData: BookmarkData
	groupIndex: number
	handleBookmarkFormVisible: React.MouseEventHandler<HTMLButtonElement>
	handleGroupFormVisible: React.MouseEventHandler<HTMLButtonElement>
	isGroupDefault: boolean
}) {
	const bookmarkGroups = useSelector((state: RootState) => state.bookmarks)
	const { selectionMode } = useSelector((state: RootState) => state.selection)

	const [checkBoxToggle, setCheckBoxToggle] = useState(false)

	const dispatch = useDispatch()

	const moveGroupTo = (to: string) => {
		const toIndex = to === "up" ? -1 : 1
		const newBookmarkGroups = arrayMove(bookmarkGroups, groupIndex, groupIndex + toIndex)
		dispatch(setBookmarkGroups(newBookmarkGroups))
	}

	const selectAllGroupBookmarks = () => {
		const allThisGroupBookmarks = bookmarkData.bookmarks

		if (!checkBoxToggle) {
			dispatch(setSelectedBookmarks(allThisGroupBookmarks))
			setCheckBoxToggle(true)
			return
		}

		dispatch(removeSelectedBookmarksWithIDs(allThisGroupBookmarks.map((b) => b.id)))
		setCheckBoxToggle(false)
	}

	const buttonStyle = "flex items-center justify-center hover:opacity-50 hover:animate-pulse"

	if (bookmarkData.id === "default") {
		return <div className="mt-1"></div>
	}

	return (
		<div
			className={`
				flex items-center justify-between mx-2 px-2 py-[3px] my-2 rounded-full shadow-lg transition-all ease-in-out 
				dark:bg-[#1B1B1C] bg-[#e7e7e7] dark:shadow-[rgba(0, 0, 0, 0.603)] shadow-[#2e2e2e34]
			`}
		>
			{/* TITLE */}
			<Text className="pl-2 text-[13.5px] font-semibold text-center truncate max-w-xs">
				{bookmarkData.title}
			</Text>

			{/* BUTTONS */}
			{!selectionMode ? (
				<div className="flex items-center justify-between">
					{/* MOVE UP */}
					{groupIndex !== 1 && (
						<button
							className={buttonStyle}
							onClick={() => moveGroupTo("up")}
							title="Move Group Up"
						>
							<AiOutlineArrowUp
								size={17}
								className="themed mr-[2px]"
							/>
						</button>
					)}

					{/* MOVE DOWN */}
					{groupIndex !== bookmarkGroups.length - 1 && (
						<button
							className={buttonStyle}
							onClick={() => moveGroupTo("down")}
							title="Move Group Down"
						>
							<AiOutlineArrowDown
								size={17}
								className="themed mr-[2px]"
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
								className="themed mr-[1px]"
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
							className="themed"
						/>
					</button>
				</div>
			) : (
				<div className={`p-1 pb-0`}>
					<CheckBox
						onChange={selectAllGroupBookmarks}
						checked={checkBoxToggle}
					/>
				</div>
			)}
		</div>
	)
}

export default memo(GroupHeader, (prevProps, nextProps) => {
	return (
		prevProps.bookmarkData === nextProps.bookmarkData &&
		prevProps.groupIndex === nextProps.groupIndex &&
		prevProps.handleBookmarkFormVisible === nextProps.handleBookmarkFormVisible &&
		prevProps.handleGroupFormVisible === nextProps.handleGroupFormVisible &&
		prevProps.isGroupDefault === nextProps.isGroupDefault
	)
})
