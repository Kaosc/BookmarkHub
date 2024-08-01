import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { deleteSelectedBookmarks } from "../redux/features/bookmarkSlice"

import { IoMdClose } from "react-icons/io"
import { MdDeleteForever, MdSelectAll } from "react-icons/md"
import { RiFolderTransferLine } from "react-icons/ri"

import Text from "./ui/Text"
import Confirmation from "./Confirmation"
import { clearAllSelections, setSelectedBookmarks } from "../redux/features/selectionSlice"

export default function SelectionNavbar({
	handleGroupFormVisible,
	handleSelectionMode,
}: {
	handleGroupFormVisible: (e: React.MouseEvent<HTMLButtonElement>, edit?: boolean) => void
	handleSelectionMode: () => void
}) {
	const [dialogVisible, setDialogVisible] = useState(false)

	const { selectedBookmarks } = useSelector((state: RootState) => state.selection)
	const bookmarks = useSelector((state: RootState) => state.bookmarks)
	const dispatch = useDispatch()

	const handleDeleteSelectedBookmarks = () => {
		dispatch(deleteSelectedBookmarks(selectedBookmarks.map((bookmark) => bookmark.id)))
		handleSelectionMode()
	}

	const handleMoveSelectedBookmarks = (e: React.MouseEvent<HTMLButtonElement>) => {
		handleGroupFormVisible(e, true)
	}

	const handleSelectAllBookmarks = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()

		if (selectedBookmarks.length !== 0) {
			dispatch(clearAllSelections())
		}

		const allBookmarksArray = bookmarks.map((bookmark) => bookmark.bookmarks).flat(1)

		if (selectedBookmarks.length === allBookmarksArray.length) {
			dispatch(clearAllSelections())
			return
		}

		dispatch(setSelectedBookmarks(allBookmarksArray))
	}

	const toggleDialog = () => setDialogVisible((prev) => !prev)

	const reaload = () => window.location.reload()

	const buttonStyle = "themed hover:opacity-50 transition-all ease-in-out duration-150"

	return (
		<div className={`flex items-center justify-between w-full animate-in fade-in-0 duration-300`}>
			{/* Confirmation dialog before deletion of selected bookmarks */}
			{dialogVisible && (
				<Confirmation
					title="Delete Selected Bookmarks"
					onConfirm={handleDeleteSelectedBookmarks}
					onDecline={toggleDialog}
					onConfirmText="Delete"
				/>
			)}

			<div className="flex items-center justify-center">
				<img
					onClick={reaload}
					src="/favicon.png"
					alt="logo"
					className="w-[24px] h-[24px] mr-2"
				/>
				<Text className="font-semibold items-center justify-center">
					<span className="font-bold text-xl rounded-md ml-1 mr-3 ">{selectedBookmarks.length}</span>
					{selectedBookmarks.length >= 2 ? "bookmarks" : "bookmark"} selected
				</Text>
			</div>

			<div className="flex items-center justify-end">
				<button
					onClick={handleSelectAllBookmarks}
					className={buttonStyle}
					title="Move Selected Bookmarks"
				>
					<MdSelectAll size={27} />
				</button>

				<button
					onClick={toggleDialog}
					title="Delete Selected Bookmarks"
				>
					<MdDeleteForever
						size={26}
						className="themed hover:opacity-50 transition-all ease-in-out duration-150 mr-1"
					/>
				</button>

				<button
					onClick={handleMoveSelectedBookmarks}
					className={buttonStyle}
					title="Move Selected Bookmarks"
				>
					<RiFolderTransferLine size={26} />
				</button>

				<div className="w-[1px] h-[24px] mx-2 ml-3 bg-black dark:bg-white"></div>

				<button
					onClick={handleSelectionMode}
					className={buttonStyle}
					title="Move Selected Bookmarks"
				>
					<IoMdClose size={30} />
				</button>
			</div>
		</div>
	)
}
