import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { nanoid } from "nanoid"

import { BsGithub } from "react-icons/bs"
import { FaGlobeAmericas } from "react-icons/fa"
import { AiOutlineMail } from "react-icons/ai"
import { IoMdClose, IoMdSettings } from "react-icons/io"
import { BiMoon, BiSolidMoon, BiLinkExternal } from "react-icons/bi"
import { TbMoonStars } from "react-icons/tb"
import { PiArrowRight } from "react-icons/pi"
import { CiExport, CiImport } from "react-icons/ci"

import { setSettings, toggleSettings } from "../redux/features/settingsSlice"
import { setBookmarkGroups } from "../redux/features/bookmarkSlice"

import Switch from "../components/ui/Switch"
import Divider from "../components/ui/Divider"
import Text from "../components/ui/Text"
import Button from "../components/ui/Button"
import Confirmation from "../components/Confirmation"

import { notify } from "../utils/notify"
import { storeSettings } from "../utils/localStorage"
import { GITHUBREPO, KAOSCWEB } from "../utils/constants"

export default function Settings() {
	const bookmarkGroups = useSelector((state: RootState) => state.bookmarks)
	const settings = useSelector((state: RootState) => state.settings)
	const dispatch = useDispatch()

	const [confirmFromVisible, setConfirmFromVisible] = useState(false)

	useEffect(() => {
		storeSettings(settings)
	}, [settings])

	const handleConfirmFromVisible = () => {
		setConfirmFromVisible((prev) => !prev)
	}

	const handleSettingsVisible = () => {
		dispatch(toggleSettings())
	}

	const handleShowBookmarksTitle = () => {
		dispatch(setSettings({ showBookmarksTitle: !settings.showBookmarksTitle }))
	}

	const handleAllowTwoLineTitle = () => {
		dispatch(setSettings({ allowTwoLineTitle: !settings.allowTwoLineTitle }))
	}

	const handleTheme = (theme: string) => {
		if (theme === "dark") {
			document.documentElement.classList.add("dark")
		} else if (theme === "light") {
			document.documentElement.classList.remove("dark")
		} else {
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark")
			} else {
				document.documentElement.classList.remove("dark")
			}
		}
		dispatch(setSettings({ theme: theme }))
	}

	const handleImport = () => {
		const input = document.createElement("input")
		input.type = "file"
		input.accept = ".json"
		input.onchange = (event) => {
			const target = event.target as HTMLInputElement
			const file: File = (target.files as FileList)[0]
			const reader = new FileReader()
			reader.readAsText(file)
			reader.onload = (event) => {
				const target = event.target as FileReader
				let data = null

				try {
					data = JSON.parse(target.result as string)
				} catch (error) {
					notify(
						"Invalid file. Please make sure that file is a imported from the app",
						settings.theme,
						true,
						10000
					)
					return
				}

				let newState = []

				// Generate new ids
				const importedBookmarkGroups = data.map((bookmarkGroup: BookmarkData) => {
					const groupId = bookmarkGroup?.id === "default" ? "default" : nanoid()
					return {
						id: groupId,
						title: bookmarkGroup.title,
						bookmarks: bookmarkGroup.bookmarks.map((bookmark: Bookmark) => {
							const bookmarkId = nanoid()
							return {
								...bookmark,
								id: bookmarkId,
								groupId: groupId,
							}
						}),
					}
				})

				const importedDefaultBookmarks = importedBookmarkGroups.find(
					(bookmarkGroup: BookmarkData) => bookmarkGroup.id === "default"
				).bookmarks

				newState = [
					...bookmarkGroups.map((bookmarkGroup: BookmarkData) => {
						if (bookmarkGroup.id === "default") {
							return {
								...bookmarkGroup,
								bookmarks: [...bookmarkGroup.bookmarks, ...importedDefaultBookmarks],
							}
						} else {
							return bookmarkGroup
						}
					}),
					...importedBookmarkGroups.filter((bookmarkGroup: BookmarkData) => bookmarkGroup.id !== "default"),
				]

				dispatch(setBookmarkGroups(newState))
				notify("Bookmarks imported", settings.theme)
			}
		}
		input.click()
	}

	const handleExport = () => {
		const exportableBookmarkGroups = bookmarkGroups.map((bookmarkGroup: BookmarkData) => {
			return {
				...bookmarkGroup,
				bookmarks: bookmarkGroup.bookmarks.map((bookmark: Bookmark) => {
					return {
						title: bookmark.title,
						url: bookmark.url,
						favicon: bookmark.favicon,
					}
				}),
			}
		})

		const dataStr =
			"data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportableBookmarkGroups))
		const downloadAnchorNode = document.createElement("a")
		downloadAnchorNode.setAttribute("href", dataStr)
		downloadAnchorNode.setAttribute("download", "bookmarks.json")
		document.body.appendChild(downloadAnchorNode) // required for firefox
		downloadAnchorNode.click()
		downloadAnchorNode.remove()

		notify("Bookmarks exported", settings.theme)
	}

	const handleWipeData = () => {
		localStorage.clear()
		window.location.reload()
	}

	const ThemeIcon = () => {
		if (settings.theme === "dark") {
			return (
				<BiMoon
					size={20}
					className="text-white"
				/>
			)
		} else if (settings.theme === "light") {
			return (
				<BiSolidMoon
					size={20}
					className="text-black"
				/>
			)
		} else {
			return (
				<TbMoonStars
					size={20}
					className="text-white"
				/>
			)
		}
	}

	const SettingsHeader = () => (
		<div
			className="flex items-center justify-between w-full h-16 px-3 border-b-[1px] mb-3 sticky top-0 left-0 z-30
				bg-gradient-to-r from-zinc-200 to-zinc-50 dark:from-[#0e0e0e] dark:to-zinc-950 
				border-b-[#d8d8d8] dark:border-b-[#1b1b1b] shadow-xl shadow-[#a0a0a069] dark:shadow-[#00000069]"
		>
			<div className="flex items-center justify-center">
				<IoMdSettings
					size={25}
					className="text-black dark:text-white"
				/>
				<Text className="ml-2 text-xl">Settings</Text>
			</div>
			<button
				className="text-black dark:text-white"
				onClick={handleSettingsVisible}
			>
				<IoMdClose size={25} />
			</button>
		</div>
	)

	const RightIcon = () => (
		<PiArrowRight
			size={24}
			className="mr-1 hover:opacity-50 transition-all ease-in-out text-black dark:text-white"
		/>
	)

	return (
		<>
			{confirmFromVisible && (
				<Confirmation
					title="Wipe all data"
					onConfirm={handleWipeData}
					onDecline={handleConfirmFromVisible}
					onConfirmText="Wipe"
				/>
			)}
			<div
				className={`absolute z-40 top-0 left-0 overflow-y-auto w-[435px] h-[550px] bg-gradient-to-r 
				from-zinc-200 to-zinc-50 dark:from-[#0e0e0e] dark:to-zinc-950 
				${settings.visible ? "visible animate-in fade-in-0 " : "invisible animate-out fade-out-0"} `}
			>
				<SettingsHeader />

				<Text className="text-center text-2xl mt-5 mb-4">General</Text>

				<div className="flex flex-col items-center">
					{/* THEME */}
					<div className="flex flex-col items-center justify-between bg-[#d8d8d8] dark:bg-[#1f1e1eb7] w-[80%] rounded-lg p-3">
						<div className="group flex items-center justify-between w-3/4 z-20 mt-3">
							<div className="flex items-center justify-center">
								<ThemeIcon />
								<Text className="ml-2">Theme</Text>
							</div>
							<button className="flex items-center justify-between">
								<Text>{settings.theme?.toUpperCase()}</Text>
							</button>

							<div
								className="hidden absolute right-[90px] top-[170px] group-hover:flex group-hover:opacity-100 
							transition-all ease-in-out animate-in fade-in-0"
							>
								<div className="dropdownContainer">
									<button
										onClick={() => handleTheme("light")}
										className="flex w-full items-center hover:opacity-50 my-[8px]"
									>
										<Text className="text-[12px]">LIGHT</Text>
									</button>
									<Divider />
									<button
										onClick={() => handleTheme("dark")}
										className="flex w-full items-center hover:opacity-50 my-[8px]"
									>
										<Text className="text-[12px]">DARK</Text>
									</button>
									<Divider />
									<button
										onClick={() => handleTheme("system")}
										className="flex w-full items-center hover:opacity-50 my-[8px]"
									>
										<Text className="text-[12px]">SYSTEM</Text>
									</button>
								</div>
							</div>
						</div>

						{/* SHOW TITLE TOGGLE */}
						<div className="flex justify-between w-3/4 mt-5">
							<div className="flex">
								<Text>Show bookmark titles</Text>
							</div>
							<Switch
								checked={settings.showBookmarksTitle}
								onChange={handleShowBookmarksTitle}
							/>
						</div>

						{/* SHOW TWO LINE TOGGLE */}
						<div className="flex justify-between w-3/4 mt-1">
							<div className="flex">
								<Text>Allow two lines title</Text>
							</div>
							<Switch
								checked={settings.allowTwoLineTitle}
								onChange={handleAllowTwoLineTitle}
							/>
						</div>
					</div>

					<Text className="text-center text-2xl my-5">Export & Import</Text>

					<div className="flex flex-col items-center justify-between bg-[#d8d8d8] dark:bg-[#1f1e1eb7] w-[80%] rounded-lg p-3 py-4">
						{/* EXPORT */}
						<Button
							onClick={handleImport}
							className="flex items-center text-center justify-center mt-1 w-3/4 "
						>
							<CiImport
								size={20}
								className="mr-2"
							/>
							Import bookmarks
						</Button>
						<Button
							onClick={handleExport}
							className="flex items-center text-center justify-center mt-3 w-3/4 "
						>
							<CiExport
								size={20}
								className="mr-2"
							/>
							Export bookmarks
						</Button>
					</div>

					<Text className="text-center text-2xl my-5">About</Text>

					<div className="flex flex-col items-center justify-between bg-[#d8d8d8] dark:bg-[#1f1e1eb7] w-[80%] rounded-lg p-3">
						<div className="flex items-center justify-between w-4/5 my-1 p-1">
							<Text> Version </Text>
							<Text> 1.0.0 </Text>
						</div>

						<button
							onClick={() => window.open(KAOSCWEB, "_blank")}
							className="flex items-center justify-between w-4/5 my-1 hover:opacity-80 hover:bg-[#383838] p-1 rounded-md hover:animate-pulse"
						>
							<div className="flex items-center ">
								<FaGlobeAmericas
									size={14}
									className="mr-1 text-black dark:text-white"
								/>
								<Text className=""> Website </Text>
							</div>
							<RightIcon />
						</button>

						<button
							onClick={() => window.open(`${KAOSCWEB}/contact`, "_blank")}
							className="flex items-center justify-between w-4/5 my-1 hover:opacity-80 hover:bg-[#383838] p-1 rounded-md hover:animate-pulse"
						>
							<div className="flex items-center">
								<AiOutlineMail
									size={14}
									className="mr-1 text-black dark:text-white"
								/>
								<Text> Contact </Text>
							</div>
							<RightIcon />
						</button>

						<button
							onClick={() => window.open(GITHUBREPO, "_blank")}
							className="flex items-center justify-between w-4/5 my-1 hover:opacity-80 hover:bg-[#383838] p-1 rounded-md hover:animate-pulse"
						>
							<div className="flex items-center">
								<BsGithub
									size={14}
									className="mr-1 text-black dark:text-white"
								/>
								<Text> Github </Text>
							</div>
							<RightIcon />
						</button>

						<button
							onClick={() => window.open(`${KAOSCWEB}/#products`, "_blank")}
							className="flex items-center justify-between w-4/5 my-1 hover:opacity-80 hover:bg-[#383838] p-1 rounded-md hover:animate-pulse"
						>
							<div className="flex items-center">
								<BiLinkExternal
									size={14}
									className="mr-1 text-black dark:text-white"
								/>
								<Text> Other Apps </Text>
							</div>
							<RightIcon />
						</button>

						{/* <button className="flex items-center justify-between w-4/5 my-1 hover:opacity-80 hover:bg-[#383838] p-1 rounded-md hover:animate-pulse">
							<div className="flex items-center">
								<TbLicense
									size={14}
									className="mr-1 text-black dark:text-white"
								/>
								<Text> Open Source Licenses </Text>
							</div>
							<RightIcon />
						</button> */}
					</div>

					{/* RESET */}
					<Text className="text-center text-2xl my-5">Danger Zone</Text>
					<div className="flex flex-col items-center justify-between bg-[#f3d0d0] dark:bg-[#3f2222] w-[80%] rounded-lg p-3 mb-10">
						<Text className=" text-sm text-center my-1">
							This option deletes all your bookmarks and settings forever. Please export your bookmarks before
							doing this.
						</Text>

						<Button
							onClick={() => setConfirmFromVisible(true)}
							className="flex items-center text-center justify-center my-3 w-3/4 dangerButton"
						>
							WIPE ALL DATA
						</Button>
					</div>
				</div>
			</div>
		</>
	)
}
