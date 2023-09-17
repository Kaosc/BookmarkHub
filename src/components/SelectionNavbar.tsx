import React from "react"
import { useDispatch, useSelector } from "react-redux"

import { deleteSelectedBookmarks } from "../redux/features/bookmarkSlice"

import { MdDeleteForever } from "react-icons/md"
import { IoMdClose } from "react-icons/io"
import { RiFolderTransferLine } from "react-icons/ri"

import Text from "./ui/Text"

export default function SelectionNavbar({
	handleGroupFormVisible,
	handleSelectionMode,
}: {
	handleGroupFormVisible: (e: React.MouseEvent<HTMLButtonElement>, edit?: boolean) => void
	handleSelectionMode: () => void
}) {
	const { selectedBookmarks } = useSelector((state: RootState) => state.selection)
	const dispatch = useDispatch()

	const handleDeleteSelectedBookmarks = () => {
		dispatch(deleteSelectedBookmarks(selectedBookmarks.map((bookmark) => bookmark.id)))
		handleSelectionMode()
	}

	const handleMoveSelectedBookmarks = (e: React.MouseEvent<HTMLButtonElement>) => {
		handleGroupFormVisible(e, true)
	}

	return (
		<div className={`flex items-center justify-between w-full animate-in fade-in-0 duration-300`}>
			<div className="flex items-center justify-center">
				<img
					onClick={() => window.location.reload()}
					src="/favicon.png"
					alt="logo"
					className="w-[24px] h-[24px] mr-2"
				/>
				<Text className="font-semibold">
					{selectedBookmarks.length} {selectedBookmarks.length > 1 ? "bookmarks" : "bookmark"} selected
				</Text>
			</div>

			<div className="flex items-center justify-end">
				<button onClick={handleDeleteSelectedBookmarks}>
					<MdDeleteForever
						size={26}
						className="text-black dark:text-white hover:opacity-50 transition-all ease-in-out duration-150 mr-1"
					/>
				</button>

				<button
					onClick={handleMoveSelectedBookmarks}
					className="text-black dark:text-white hover:opacity-50 transition-all ease-in-out duration-150"
				>
					<RiFolderTransferLine size={26} />
				</button>

				<div className="w-[1px] h-[24px] mx-2 bg-black dark:bg-white"></div>

				<IoMdClose
					onClick={handleSelectionMode}
					size={30}
					className="text-black dark:text-white hover:opacity-50 transition-all ease-in-out duration-150"
				/>
			</div>
		</div>
	)
}
