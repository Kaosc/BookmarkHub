import { useState } from "react"
import { useDispatch } from "react-redux"
import { nanoid } from "nanoid"

import { IoMdSettings } from "react-icons/io"
import { IoIosAdd } from "react-icons/io"
import { AiOutlineFolderOpen } from "react-icons/ai"
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

	const handleBookmarkFormVisible = () => {
		if (groupFormVisible) setGroupFormVisible(false)
		setBookmarkFormVisible((prev) => !prev)
	}

	const handleGroupFormVisible = () => {
		if (bookmarkFormVisible) setBookmarkFormVisible(false)
		setGroupFormVisible((prev) => !prev)
	}

	const addActiveTabToBookmark = async () => {
		let activeTab: chrome.tabs.Tab[] | undefined = await chrome?.tabs?.query({
			active: true,
			currentWindow: true,
		})

		if (activeTab && activeTab[0]?.url) {
			notify("Active Tab Added to Bookmark")
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
	}

	const texts = {
		addBookmark: "Add Bookmark",
		addGroup: "Add Group",
	}

	return (
		<>
			{bookmarkFormVisible && <BookmarkForm handleFormVisible={handleBookmarkFormVisible} />}
			{groupFormVisible && <GroupForm handleFormVisible={handleGroupFormVisible} />}
			<div className="z-20 sticky flex items-center justify-between w-full h-16 px-4 bg-gradient-to-r from-[#0e0e0e] to-zinc-950 border-b-[1px] border-b-[#1b1b1b]">
				<div className="flex items-center justify-center">
					<img
						src="/favicon.png"
						alt="logo"
						className="w-[24px] h-[24px] mr-2"
					/>
					<SearchBar />
				</div>

				<div className="flex items-center justify-center">
					<button
						className="flex items-center justify-center hover:opacity-50 hover:animate-pulse mr-1"
						onClick={addActiveTabToBookmark}
					>
						<LiaFileImportSolid
							size={23}
							className="text-white"
						/>
					</button>
					<div className="group">
						<button className="flex items-center justify-center hover:opacity-50 hover:animate-pulse mr-1">
							<IoIosAdd
								size={37}
								className="text-white"
							/>
						</button>

						{/* DROPDOWN */}
						<div className="dropdownContainer">
							<button
								onClick={handleBookmarkFormVisible}
								className="flex w-full items-center hover:opacity-50 m-1"
							>
								<BiBookmarkPlus
									size={20}
									className="text-white mr-2"
								/>
								<p className="text-[13px] text-left text-white">{texts.addBookmark}</p>
							</button>
							<Divider />
							<button
								onClick={handleGroupFormVisible}
								className="flex w-full items-center hover:opacity-50 m-1"
							>
								<AiOutlineFolderOpen
									size={20}
									className="text-white mr-2"
								/>
								<p className="text-[13px] text-left text-white">{texts.addGroup}</p>
							</button>
						</div>
					</div>

					<button className="flex items-center justify-center hover:opacity-50 hover:animate-pulse">
						<IoMdSettings
							size={23}
							className="text-white"
						/>
					</button>
				</div>
			</div>
		</>
	)
}
