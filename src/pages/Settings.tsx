import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { nanoid } from "nanoid"

import { BiMoon, BiSolidMoon, BiLinkExternal } from "react-icons/bi"
import { IoMdClose, IoMdSettings } from "react-icons/io"
import { CiExport, CiImport } from "react-icons/ci"
import { FaGlobeAmericas, FaStar } from "react-icons/fa"
import { AiOutlineMail } from "react-icons/ai"
import { PiArrowRight } from "react-icons/pi"
import { TbMoonStars } from "react-icons/tb"
import { BsGithub } from "react-icons/bs"

import { setSettings, toggleSettings } from "../redux/features/settingsSlice"
import { setBookmarkGroups } from "../redux/features/bookmarkSlice"

import Confirmation from "../components/Confirmation"
import Divider from "../components/ui/Divider"
import Switch from "../components/ui/Switch"
import Button from "../components/ui/Button"
import Text from "../components/ui/Text"

import { GITHUB_REPO, WEBSITE, THEMES, CHROME_STORE_URL } from "../utils/constants"
import { setTheme } from "../utils/setTheme"
import { notify } from "../utils/notify"

export default function Settings() {
	const bookmarkGroups = useSelector((state: RootState) => state.bookmarks)
	const settings = useSelector((state: RootState) => state.settings)
	const dispatch = useDispatch()

	const [confirmFromVisible, setConfirmFromVisible] = useState(false)

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

	const handleTheme = (theme: AppTheme) => {
		setTheme(theme)
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
		downloadAnchorNode.setAttribute("download", "BookmarkHub-Backup.json")
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
		<div className="settingsHeader">
			<div className="flex items-center justify-center">
				<IoMdSettings
					size={25}
					className="themed"
				/>
				<Text className="ml-2 text-xl">Settings</Text>
			</div>
			<button
				className="themed"
				onClick={handleSettingsVisible}
			>
				<IoMdClose size={25} />
			</button>
		</div>
	)

	const RightIcon = () => (
		<PiArrowRight
			size={24}
			className="mr-1 hover:opacity-50 animated themed"
		/>
	)

	const SettingContainer = ({ children }: { children: React.ReactNode }) => (
		<section className="flex flex-col items-center justify-between bg-[#d8d8d8] dark:bg-[#1f1e1eb7] w-[80%] rounded-lg p-3">
			{children}
		</section>
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
				className={`absolute z-40 top-0 left-0 overflow-y-auto w-[450px] h-[565px] 
				bg-gradient-to-r from-zinc-200 to-zinc-50 dark:from-[#0e0e0e] dark:to-zinc-950 
				${settings.visible ? "visible animate-in fade-in-0 " : "invisible animate-out fade-out-0"} `}
			>
				<SettingsHeader />

				<div className="flex flex-col items-center">
					{/* GENERAL */}
					<Text className="text-center text-2xl mt-2 mb-4">General</Text>
					<SettingContainer>
						{/* THEME */}
						<div className="group flex items-center justify-between w-3/4 z-20 mt-3">
							<div className="flex items-center justify-center">
								<ThemeIcon />
								<Text className="ml-2">Theme</Text>
							</div>
							<button className="flex items-center justify-between">
								<Text>{settings.theme?.toUpperCase()}</Text>
							</button>

							<div className="hidden absolute right-[90px] top-[170px] group-hover:flex group-hover:opacity-100 animated animate-in fade-in-0">
								<div className="dropdownContainer">
									{THEMES.map((theme: AppTheme, index) => (
										<div key={index}>
											{index ? <Divider /> : ""}
											<button
												onClick={() => handleTheme(theme)}
												className="flex w-full items-center hover:opacity-50 my-[8px]"
											>
												<Text className="text-[12px]">{theme.toUpperCase()}</Text>
											</button>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* SHOW TITLE */}
						<div className="flex justify-between w-3/4 mt-5">
							<div className="flex">
								<Text>Show bookmark titles</Text>
							</div>
							<Switch
								checked={settings.showBookmarksTitle}
								onChange={handleShowBookmarksTitle}
							/>
						</div>

						{/* SHOW TWO LINE */}
						<div className="flex justify-between w-3/4 mt-1">
							<div className="flex">
								<Text>Allow two lines title</Text>
							</div>
							<Switch
								checked={settings.allowTwoLineTitle}
								onChange={handleAllowTwoLineTitle}
							/>
						</div>
					</SettingContainer>

					{/* EXPORT & IMPORT */}
					<Text className="text-center text-2xl my-5">Export & Import</Text>
					<SettingContainer>
						{["Import", "Export"].map((item, index) => (
							<Button
								key={item}
								onClick={index ? handleExport : handleImport}
								className={`flex items-center text-center justify-center mt-1 w-3/4 ${index && "mt-3"}`}
							>
								{index ? (
									<CiExport
										size={20}
										className="mr-2"
									/>
								) : (
									<CiImport
										size={20}
										className="mr-2"
									/>
								)}
								{item} Bookmarks
							</Button>
						))}
					</SettingContainer>

					{/* ABOUT */}
					<Text className="text-center text-2xl my-5">About</Text>
					<SettingContainer>
						<div className="flex items-center justify-between w-4/5 px-3 py-1">
							<Text> Version </Text>
							<Text> 1.0.7 </Text>
						</div>
						<Divider className="w-4/5" />

						{[
							{
								title: "Rate the app",
								url: CHROME_STORE_URL,
								icon: <FaStar size={14} />,
							},
							{
								title: "Github",
								url: GITHUB_REPO,
								icon: <BsGithub size={14} />,
							},
							{
								title: "Contact",
								url: `${WEBSITE}/contact`,
								icon: <AiOutlineMail size={14} />,
							},
							{
								title: "Website",
								url: WEBSITE,
								icon: <FaGlobeAmericas size={14} />,
							},
							{
								title: "Other Apps",
								url: `${WEBSITE}/#products`,
								icon: <BiLinkExternal size={14} />,
							},
						].map(({ title, url, icon }) => {
							const handleClick = () => window.open(url, "_blank")
							return (
								<div
									key={title}
									className="flex items-center justify-between w-4/5 hover:bg-zinc-400 dark:hover:bg-zinc-700 p-1 rounded-md hover:animate-pulse hover:opacity-80"
								>
									<button
										onClick={handleClick}
										className="flex items-center justify-between w-full"
									>
										<div className="flex items-center">
											<div className="themed mr-2 text-[14px]">{icon}</div>
											<Text> {title} </Text>
										</div>
										<RightIcon />
									</button>
								</div>
							)
						})}
					</SettingContainer>

					{/* RESET */}
					<Text className="text-center text-2xl my-5">Danger Zone</Text>
					<div className="flex flex-col items-center justify-between bg-[#fd44445e] dark:bg-[#ff000027] w-[80%] rounded-lg p-3 mb-10">
						<Text className=" text-sm text-center my-1">
							This option deletes all your bookmarks and settings forever. Please export your bookmarks before
							doing this.
						</Text>
						<Button
							onClick={handleConfirmFromVisible}
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
