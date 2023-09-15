import { useState, useRef, useCallback } from "react"
import { useDispatch } from "react-redux"
import { nanoid } from "nanoid"

import { IoMdSettings } from "react-icons/io"
import { IoAddCircleOutline } from "react-icons/io5"
import { LuFolderPlus } from "react-icons/lu"
import { TbFolderCog } from "react-icons/tb"
import { BiBookmarkPlus } from "react-icons/bi"
import { LiaFileImportSolid } from "react-icons/lia"

import { addBookmark } from "../redux/features/bookmarkSlice"

import Divider from "./ui/Divider"
import SearchBar from "./SearchBar"
import BookmarkForm from "./form/BookmarkForm"
import GroupForm from "./form/GroupForm"
import { faviconPlaceHolder } from "../utils/constants"
import { notify } from "../utils/notify"

export default function Navbar() {
	const dispatch = useDispatch()

	const [bookmarkFormVisible, setBookmarkFormVisible] = useState(false)
	const [groupFormVisible, setGroupFormVisible] = useState(false)
	const editMode = useRef(false)

	const handleBookmarkFormVisible = useCallback(() => {
		if (groupFormVisible) setGroupFormVisible(false)
		setBookmarkFormVisible((prev) => !prev)
	}, [groupFormVisible])

	const handleGroupFormVisible = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>, edit?: boolean) => {
			if (e) e?.preventDefault()
			if (bookmarkFormVisible) setBookmarkFormVisible(false)

			if (edit) editMode.current = true
			else editMode.current = false

			setGroupFormVisible((prev) => !prev)
		},
		[bookmarkFormVisible]
	)

	const addActiveTabToBookmark = useCallback(async () => {
		let activeTab: chrome.tabs.Tab[] | undefined = await chrome?.tabs?.query({
			active: true,
			currentWindow: true,
		})

		if (activeTab && activeTab[0]?.url) {
			dispatch(
				addBookmark({
					id: nanoid(),
					favicon: activeTab[0]?.favIconUrl || faviconPlaceHolder,
					title: activeTab[0]?.title || "Untitled",
					url: activeTab[0]?.url,
					groupId: "default",
				})
			)
		} else {
			notify("No Active Tab", true)
		}
	}, [dispatch])

	const texts = {
		addBookmark: "Add Bookmark",
		addGroup: "Add Group",
	}

	const styles = {
		button: "hover:opacity-50 transition-all ease-in-out duration-150",
		drowdownButton: "flex w-full items-center hover:opacity-50 my-[8px]",
	}

	return (
		<div className="z-20 sticky flex items-center justify-between w-full h-16 px-3 bg-gradient-to-r from-[#0e0e0e] to-zinc-950 border-b-[1px] border-b-[#1b1b1b] shadow-xl shadow-[#00000069]">
			{bookmarkFormVisible && <BookmarkForm handleFormVisible={handleBookmarkFormVisible} />}
			{groupFormVisible && (
				<GroupForm
					handleFormVisible={handleGroupFormVisible}
					editMode={editMode}
				/>
			)}
			{/* SEARCH BAR  */}
			<div className="flex items-center justify-center">
				<img
					src="/favicon.png"
					alt="logo"
					className="w-[24px] h-[24px] mr-2"
				/>
				<SearchBar />
			</div>

			{/* BUTTONS */}
			<div className="flex w-1/3 items-center justify-evenly">
				{/* GET ACTIVE TAB */}
				<button
					className={styles.button}
					onClick={addActiveTabToBookmark}
				>
					<LiaFileImportSolid
						size={25}
						className="text-white"
					/>
				</button>

				{/* ADD BOOKMARK/GROUP */}
				<div className="group flex items-center justify-center">
					<button className={styles.button}>
						<IoAddCircleOutline
							size={25}
							className="text-white"
						/>
					</button>

					{/* DROPDOWN */}
					<div className="hidden absolute right-[30px] top-9 w-[130px] group-hover:flex group-hover:opacity-100 transition-all ease-in-out animate-in fade-in-0 duration-300">
						<div className="dropdownContainer">
							<button
								onClick={handleBookmarkFormVisible}
								className={styles.drowdownButton}
							>
								<BiBookmarkPlus
									size={20}
									className="text-white mr-2"
								/>
								<p className="text-[12px] text-white">{texts.addBookmark}</p>
							</button>
							<Divider />
							<button
								onClick={(e) => handleGroupFormVisible(e)}
								className={styles.drowdownButton}
							>
								<LuFolderPlus
									size={19}
									className="text-white mr-2"
								/>
								<p className="text-[12px] text-white">{texts.addGroup}</p>
							</button>
						</div>
					</div>
				</div>

				{/* REORDER GROUPS */}
				<button
					className={styles.button}
					onClick={(e) => handleGroupFormVisible(e, true)}
				>
					<TbFolderCog
						size={25}
						className="text-white"
					/>
				</button>

				{/* SETTINGS */}
				<button
					className={styles.button}
					onClick={() => {
						localStorage.clear()
						window.location.reload()
					}}
				>
					<IoMdSettings
						size={24}
						className="text-white"
					/>
				</button>
			</div>
		</div>
	)
}
