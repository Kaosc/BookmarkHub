import { useState, useEffect, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import ImageUploading, { ImageType } from "react-images-uploading"
import { nanoid } from "nanoid"
import Select from "react-select"

import { BiCopy, BiUpload } from "react-icons/bi"
import { MdDeleteForever, MdRefresh } from "react-icons/md"
import { IoMdAdd } from "react-icons/io"

import { addBookmark, deleteBookmark, editBookmark } from "../../redux/features/bookmarkSlice"

import FormButtons from "./FormButtons"
import Dialog from "../Dialog"
import Confirmation from "../Confirmation"

import ActivityIndicator from "../ui/ActivityIndicator"
import Text from "../ui/Text"
import Button from "../ui/Button"

import { faviconPlaceHolder } from "../../utils/constants"
import { notify } from "../../utils/notify"
import { fetchFavicon } from "../../api/fetchFavicon"

export default function BookmarkForm({
	bookmark,
	initGroupToAdd,
	handleFormVisible,
}: {
	bookmark?: Bookmark
	initGroupToAdd?: GroupInfo
	handleFormVisible: Function
}) {
	const { theme } = useSelector((state: RootState) => state.settings)
	const darkMode = useMemo(
		() =>
			theme === "system"
				? window.matchMedia("(prefers-color-scheme: dark)").matches
				: theme === "dark"
				? true
				: false,
		[theme]
	)

	const bookmarkData = useSelector((state: RootState) => state.bookmarks)
	const dispatch = useDispatch()

	const [favicon, setFavicon] = useState(bookmark?.favicon || "")
	const [title, setTitle] = useState(bookmark?.title || "")
	const [url, setUrl] = useState(bookmark?.url || "")
	const [group, setGroup] = useState({
		id: bookmark?.groupId || initGroupToAdd?.id || "default",
		title:
			bookmarkData.find((bd) => bd.id === bookmark?.groupId)?.title || initGroupToAdd?.title || "Default",
	})

	const [fetchingFavicon, setFetchingFavicon] = useState(false)
	const [faviconList, setFaviconList] = useState<string[]>([])
	const [confirmFromVisible, setConfirmFromVisible] = useState(false)
	const [drowDownOpen, setDrowDownOpen] = useState(false)

	const formTitle = bookmark ? "Edit Bookmark" : "Add Bookmark"
	const maxFileSize = 1024 * 1024 * 3
	const groupOptions: any = useMemo(
		() =>
			bookmarkData.map((bdg) => ({
				value: bdg.id,
				label: bdg.title,
			})),
		[bookmarkData]
	)

	useEffect(() => {
		let timeout: NodeJS.Timeout

		timeout = setTimeout(() => {
			if (url && !favicon?.startsWith("data")) {
				if (url !== bookmark?.url) {
					setFetchingFavicon(true)
					fetchFavicon(url).then((favicons) => {
						setFaviconList(favicons)
						setFetchingFavicon(false)
					})
				}
			} else {
				setFaviconList([])
			}
		}, 1500)

		return () => clearTimeout(timeout)
	}, [url, favicon, bookmark?.url])

	const handleConfirmFromVisible = () => setConfirmFromVisible((prev) => !prev)

	const handleFaviconFetchManually = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (url) {
			setFetchingFavicon(true)
			fetchFavicon(url).then((favicons) => {
				setFaviconList(favicons)
				setFetchingFavicon(false)
			})
		}
	}

	const handleFaviconChange = (imageList: ImageType[]) => setFavicon(imageList[0]?.dataURL || "")
	const handleGroupChange = (option: any) => setGroup({ id: option.value, title: option.label })
	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
	const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)

	const handleBookmarkAdd = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()

		let newBookmark: Bookmark = {
			id: nanoid(),
			favicon: favicon || faviconList[faviconList.length - 1] || faviconPlaceHolder,
			title: title,
			url: url,
			groupId: group.id,
		}

		dispatch(addBookmark(newBookmark))
		quitFrom(e)
	}

	const handleBookmarkEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!bookmark) return

		e.preventDefault()

		let newBookmark: Bookmark = {
			id: bookmark.id,
			favicon: favicon || faviconList[faviconList.length - 1] || faviconPlaceHolder,
			title: title,
			url: url,
			groupId: group.id,
		}

		dispatch(
			editBookmark({
				bookmark: newBookmark,
				prevGroupId: bookmark?.groupId !== newBookmark.groupId ? bookmark?.groupId : undefined,
			})
		)
		quitFrom(e)
	}

	const handleBookmarkDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (!bookmark) return

		dispatch(deleteBookmark({ bookmarkId: bookmark.id, groupId: group.id }))
		quitFrom(e)
	}

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()

		if (bookmark) handleBookmarkEdit(e)
		else handleBookmarkAdd(e)
	}

	const quitFrom = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		handleFormVisible()
	}

	const handleUrlCopy = (e: React.MouseEvent<SVGSVGElement>) => {
		e.preventDefault()
		navigator.clipboard.writeText(url)
		notify("URL Copied", theme)
	}

	const SelectDropDown = useCallback(() => {
		return (
			<Select
				className="w-full mb-4"
				placeholder="Group"
				onMenuOpen={() => setDrowDownOpen(true)}
				onMenuClose={() => setDrowDownOpen(false)}
				noOptionsMessage={() => "No Group Found"}
				required
				isSearchable={true}
				value={{ value: group.id, label: group.title }}
				onChange={handleGroupChange}
				options={groupOptions}
				theme={(theme: any) => ({
					...theme,
					colors: {
						...theme.colors,
						neutral20: darkMode ? "#575757" : "#000000",
						neutral30: darkMode ? "#575757" : "#000000",
						neutral40: darkMode ? "#575757" : "#000000",
						primary25: darkMode ? "#575757" : "#000000",
						primary: darkMode ? "#46474d" : "#adadad",
						primary50: darkMode ? "#202020" : "#aaaaaa",
					},
				})}
				styles={SelectStyles(darkMode)}
			/>
		)
	}, [groupOptions, group, darkMode])

	const ImageUploadSection = () => {
		return (
			<div className="flex w-full items-center mb-4">
				<ImageUploading
					value={[{ dataURL: favicon }]}
					maxFileSize={maxFileSize}
					onChange={handleFaviconChange}
				>
					{({ imageList, onImageUpload, onImageRemoveAll, errors }) => (
						<div className="flex flex-col w-full items-center justify-between p-2 rounded-md border-[0.5px] border-[#757575] px-3 py-3">
							<div className="flex w-full items-center justify-between">
								<div className="flex">
									{imageList[0]?.dataURL && (
										<div className="flex items-center justify-center">
											<img
												src={imageList[0]?.dataURL}
												alt="favicon-preview"
												className="w-12 h-12"
											/>
										</div>
									)}
									{!imageList[0]?.dataURL && (
										<div className="flex items-center">
											<Button
												onClick={onImageUpload}
												className={`outline-dashed ring-0 h-8 w-8 flex items-center justify-center hover:opacity-80 transition-all ease-in-out duration-300`}
												props={{ type: "button" }}
											>
												<IoMdAdd size={20} />
											</Button>
											{!errors && <p className="text-sm text-gray-500 ml-3">Upload Favicon (optional)</p>}
										</div>
									)}
								</div>
								{imageList[0]?.dataURL && (
									<div className="flex items-center">
										<Button
											className={`hover:text-black px-1 z-50 mr-2`}
											onClick={onImageUpload}
											props={{ title: "Upload" }}
										>
											<BiUpload size={20} />
										</Button>
										<Button
											className={`hover:text-black px-1 z-50`}
											onClick={onImageRemoveAll}
											props={{ title: "Remove" }}
										>
											<MdDeleteForever size={20} />
										</Button>
									</div>
								)}
							</div>
							{errors && (
								<div className="ml-5">
									{errors.acceptType && (
										<span className="text-red-500 text-sm">elected file type is not allowed</span>
									)}
									{errors.maxFileSize && (
										<span className="text-red-500 text-sm">
											Selected file size exceed {maxFileSize / 1024 / 1024} MB
										</span>
									)}
								</div>
							)}
						</div>
					)}
				</ImageUploading>
			</div>
		)
	}

	const FaviconList = () => {
		if (faviconList.length > 0) {
			return (
				<div className="flex flex-wrap w-full mb-4 items-center justify-center">
					{faviconList.map((favicon) => (
						<div
							key={favicon}
							className="flex items-center justify-center w-12 h-12 m-1"
						>
							<img
								src={favicon}
								alt="favicon-preview"
								className="w-11 h-11 hover:opacity-50"
								onClick={() => setFavicon(favicon)}
							/>
						</div>
					))}
				</div>
			)
		} else if (fetchingFavicon) {
			return (
				<div className="flex w-full items-center justify-center mb-4">
					<ActivityIndicator className="w-6 h-6" />
				</div>
			)
		} else {
			return (
				<div className="flex w-full items-center justify-center mb-4">
					<Text className="text-sm">Favicons will be appear here</Text>
					<button
						onClick={handleFaviconFetchManually}
						className={`h-8 w-8 flex items-center justify-center hover:opacity-80 hover:scale-110 hover:animate-spin transition-all ease-in-out duration-300 ml-1`}
					>
						<MdRefresh
							size={23}
							className="text-black dark:text-white"
						/>
					</button>
				</div>
			)
		}
	}

	return (
		<>
			{confirmFromVisible && (
				<Confirmation
					title="Delete"
					onConfirm={handleBookmarkDelete}
					onDecline={handleConfirmFromVisible}
					onConfirmText="Delete"
				/>
			)}

			<Dialog
				title={formTitle}
				onClose={quitFrom}
				className="z-40"
				dialogClassName={`${drowDownOpen ? bookmarkData.length > 3 && "translate-y-[-60px]" : ""}`}
			>
				<ImageUploadSection />

				<FaviconList />

				<form className="flex flex-col items-center">
					{/* TITLE */}
					<input
						value={title}
						className="input"
						type="text"
						title="Bookmark Title"
						placeholder={"Title"}
						onChange={handleTitleChange}
					/>

					{/* URL */}
					<div className="relative flex w-full">
						<input
							required
							value={url}
							className="input pr-10"
							type="url"
							title="Bookmark URL"
							placeholder="URL*"
							onChange={handleUrlChange}
							autoFocus={bookmark ? false : true}
						/>
						<BiCopy
							size={22}
							title="Click to Copy URL"
							className="absolute right-3 top-3 text-black dark:text-white transition-all duration-300 ease-in-out hover:opacity-50 cursor-pointer hover:animate-pulse"
							onClick={handleUrlCopy}
						/>
					</div>

					{/* GROUP */}
					<SelectDropDown />

					<FormButtons
						handleCancel={quitFrom}
						handleDelete={handleConfirmFromVisible}
						handleSubmit={handleSubmit}
						prevValue={bookmark?.url}
						value={url}
					/>
				</form>
			</Dialog>
		</>
	)
}

const SelectStyles: any = (darkMode: boolean) => {
	return {
		control: (provided: any) => ({
			...provided,
			backgroundColor: "#00000000",
			borderRadius: 6,
			borderWidth: 0.5,
			borderColor: ["#757575", "#757575", "#757575", "#757575"],
		}),
		menu: (provided: any) => ({
			...provided,
			backgroundColor: darkMode ? "#1c1c1d" : "#dfdfdf",
		}),
		option: (provided: any, state: any) => ({
			...provided,
			backgroundColor: darkMode
				? state.isSelected
					? "#3e4047"
					: "#1c1c1d"
				: state.isSelected
				? "#bdbdbd"
				: "#dfdfdf",
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
			color: darkMode ? "#ffffff" : "#000000",
		}),
		input: (provided: any) => ({
			...provided,
			borderColor: darkMode ? "#1c1c1d" : "#dfdfdf",
			borderWidth: 0,
			color: darkMode ? "#ffffff" : "#000000",
		}),
		indicatorSeparator: (provided: any) => ({
			...provided,
			backgroundColor: darkMode ? "#cccccc" : "#000000",
		}),
		indicator: (provided: any) => ({
			...provided,
			color: darkMode ? "#cccccc" : "#000000",
		}),
		// max height of dropdown menu
		menuList: (provided: any) => ({
			...provided,
			maxHeight: 190,
		}),
	}
}
