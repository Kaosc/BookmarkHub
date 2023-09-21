import { useState, useRef, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { nanoid } from "nanoid"

import { IoMdSettings } from "react-icons/io"
import { IoAddCircleOutline } from "react-icons/io5"
import { LuFolderEdit, LuFolderPlus } from "react-icons/lu"
import { BiBookmarkPlus, BiSelectMultiple } from "react-icons/bi"
import { LiaFileImportSolid } from "react-icons/lia"

import { addBookmark } from "../redux/features/bookmarkSlice"
import { toggleSettings } from "../redux/features/settingsSlice"
import { toggleSelectionMode } from "../redux/features/selectionSlice"

import SearchBar from "./SearchBar"

import BookmarkForm from "./form/BookmarkForm"
import GroupForm from "./form/GroupForm"

import Divider from "./ui/Divider"
import Text from "./ui/Text"
import SelectionNavbar from "./SelectionNavbar"

import { notify } from "../utils/notify"
import { faviconPlaceHolder } from "../utils/constants"

export default function Navbar() {
	const { theme } = useSelector((state: RootState) => state.settings)
	const { selectionMode } = useSelector((state: RootState) => state.selection)
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
					editedTime: Date.now(),
				})
			)
		} else {
			notify("No Active Tab", theme, true)
		}
	}, [dispatch, theme])

	const handleSettingsVisible = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault()
			dispatch(toggleSettings())
		},
		[dispatch]
	)

	const handleSelectionMode = useCallback(() => {
		dispatch(toggleSelectionMode())
	}, [dispatch])

	const handleReload = () => window.location.reload()

	const texts = {
		addBookmark: "Add Bookmark",
		addGroup: "Add Group",
	}

	const styles = {
		button: "hover:opacity-50 transition-all ease-in-out duration-150",
		drowdownButton: "flex w-full items-center hover:opacity-50 my-[8px]",
	}

	return (
		<>
			{bookmarkFormVisible && <BookmarkForm handleFormVisible={handleBookmarkFormVisible} />}
			{groupFormVisible && (
				<GroupForm
					handleFormVisible={handleGroupFormVisible}
					editMode={editMode}
				/>
			)}
			<div
				className="z-20 sticky flex h-16 px-3 border-b-[1px]
				bg-gradient-to-r from-zinc-200 to-zinc-50 dark:from-[#0e0e0e] dark:to-zinc-950 
				border-b-[#d8d8d8] dark:border-b-[#1b1b1b] shadow-xl shadow-[#a0a0a069] dark:shadow-[#00000069]"
			>
				{selectionMode ? (
					<SelectionNavbar
						handleSelectionMode={handleSelectionMode}
						handleGroupFormVisible={handleGroupFormVisible}
					/>
				) : (
					<div className="flex items-center justify-between w-full animate-in fade-in-0 duration-300">
						<div className="flex items-center justify-center">
							{/* LOGO  */}
							<img
								onClick={handleReload}
								src="/favicon.png"
								alt="logo"
								className="w-[24px] h-[24px] mr-2"
							/>
							{/* SEARCH BAR  */}
							<SearchBar />
						</div>

						{/* BUTTONS */}
						<div className="flex w-2/5 items-center justify-evenly">
							{/* GET ACTIVE TAB */}
							<button
								className={styles.button}
								onClick={addActiveTabToBookmark}
							>
								<LiaFileImportSolid
									size={25}
									className="text-black dark:text-white"
								/>
							</button>

							{/* ADD BOOKMARK/GROUP */}
							<div className="group flex items-center justify-center">
								<button className={styles.button}>
									<IoAddCircleOutline
										size={25}
										className="text-black dark:text-white"
									/>
								</button>

								{/* DROPDOWN */}
								<div
									className="hidden absolute right-[30px] top-9 w-[130px] group-hover:flex group-hover:opacity-100 
									transition-all ease-in-out animate-in fade-in-0 duration-300
									"
								>
									<div className="dropdownContainer">
										<button
											onClick={handleBookmarkFormVisible}
											className={styles.drowdownButton}
										>
											<BiBookmarkPlus
												size={20}
												className="text-black dark:text-white mr-2"
											/>
											<Text className="text-[12px]">{texts.addBookmark}</Text>
										</button>
										<Divider />
										<button
											onClick={(e) => handleGroupFormVisible(e)}
											className={styles.drowdownButton}
										>
											<LuFolderPlus
												size={19}
												className="text-black dark:text-white mr-2"
											/>
											<Text className="text-[12px]">{texts.addGroup}</Text>
										</button>
									</div>
								</div>
							</div>

							{/* REORDER GROUPS */}
							<button
								className={styles.button}
								onClick={(e) => handleGroupFormVisible(e, true)}
							>
								<LuFolderEdit
									size={25}
									className="text-black dark:text-white"
								/>
							</button>

							{/* SELECTION */}
							<button
								className={styles.button}
								onClick={handleSelectionMode}
							>
								<BiSelectMultiple
									size={24}
									className="text-black dark:text-white"
								/>
							</button>

							{/* SETTINGS */}
							<button
								className={styles.button}
								onClick={handleSettingsVisible}
							>
								<IoMdSettings
									size={24}
									className="text-black dark:text-white"
								/>
							</button>
						</div>
					</div>
				)}
			</div>
		</>
	)
}
