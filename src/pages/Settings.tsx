import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { IoMdClose } from "react-icons/io"
import { IoMdSettings } from "react-icons/io"

import { setSettings, toggleSettings } from "../redux/features/settingsSlice"
import { BiMoon, BiSolidMoon } from "react-icons/bi"
import { TbMoonStars } from "react-icons/tb"
import Switch from "../components/ui/Switch"
import { storeSettings } from "../utils/localStorage"
import Divider from "../components/ui/Divider"
import Text from "../components/ui/Text"

export default function Settings() {
	const settings = useSelector((state: RootState) => state.settings)
	const dispatch = useDispatch()

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

	useEffect(() => {
		storeSettings(settings)
	}, [settings])

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
			className="flex items-center justify-between w-full h-16 px-3 border-b-[1px] mb-3
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

	return (
		<div
			className={`absolute items-center justify-center z-50 top-0 left-0 w-[435px] h-[550px] bg-gradient-to-r 
				from-zinc-200 to-zinc-50 dark:from-[#0e0e0e] dark:to-zinc-950 
				${
					settings.visible
						? "visible animate-in fade-in-0 duration-300"
						: "invisible animate-out fade-out-0 duration-300"
				} `}
		>
			<SettingsHeader />

			<div className="flex flex-col items-center w-full h-full">
				{/* THEME */}
				<div className="group flex items-center justify-between w-2/3 mt-6 z-30">
					<div className="flex items-center justify-center">
						<ThemeIcon />
						<Text className="ml-2">Theme</Text>
					</div>
					<button className="flex items-center justify-between">
						<Text>{settings.theme?.toUpperCase()}</Text>
					</button>

					<div
						className="hidden absolute right-[70px] top-[100px] group-hover:flex group-hover:opacity-100 
							transition-all ease-in-out animate-in fade-in-0 duration-300"
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
				<div className="flex justify-between w-2/3 mt-5">
					<div className="flex">
						<Text>Show bookmark titles</Text>
					</div>
					<Switch
						checked={settings.showBookmarksTitle}
						onChange={handleShowBookmarksTitle}
					/>
				</div>

				{/* SHOW TWO LINE TOGGLE */}
				<div className="flex justify-between w-2/3 mt-1">
					<div className="flex">
						<Text>Allow two lines title</Text>
					</div>
					<Switch
						checked={settings.allowTwoLineTitle}
						onChange={handleAllowTwoLineTitle}
					/>
				</div>
			</div>
		</div>
	)
}
