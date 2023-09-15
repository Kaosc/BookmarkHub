import { useState, useEffect, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import ImageUploading, { ImageType } from "react-images-uploading"
import { nanoid } from "nanoid"
import Select from "react-select"

import { BiCopy, BiUpload } from "react-icons/bi"
import { MdDeleteForever, MdRefresh } from "react-icons/md"
import { IoMdAdd } from "react-icons/io"

import { addBookmark, deleteBookmark, editBookmark } from "../../redux/features/bookmarkSlice"

import Button from "../ui/Button"
import ActivityIndicator from "../ui/ActivityIndicator"
import Dialog from "../Dialog"
import FormButtons from "./FormButtons"
import { fetchFavicon } from "../../api/fetchFavicon"
import { faviconPlaceHolder } from "../../utils/constants"
import { notify } from "../../utils/notify"

export default function BookmarkForm({
	bookmark,
	initGroupToAdd,
	handleFormVisible,
}: {
	bookmark?: Bookmark
	initGroupToAdd?: GroupInfo
	handleFormVisible: Function
}) {
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

		notify("Bookmark Added")
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

		// notify("Bookmark Edited")
		quitFrom(e)
	}

	const handleBookmarkDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (!bookmark) return

		dispatch(deleteBookmark({ bookmarkId: bookmark.id, groupId: group.id }))

		notify("Bookmark Deleted")
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
		notify("URL Copied")
	}

	const SelectDropDown = useCallback(() => {
		return (
			<Select
				className="w-full mb-4"
				placeholder="Group"
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
						primary25: "#575757",
						primary: "#46474d",
						primary50: "#202020",
					},
				})}
				styles={SelectStyles}
			/>
		)
	}, [groupOptions, group])

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
											{!errors && <p className="text-sm text-gray-400 ml-3">Upload Favicon (optional)</p>}
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
									{errors.maxNumber && (
										<span className="text-red-500 text-sm">Number of selected images exceed maxNumber</span>
									)}
									{errors.acceptType && (
										<span className="text-red-500 text-sm">Your selected file type is not allow</span>
									)}
									{errors.maxFileSize && (
										<span className="text-red-500 text-sm">
											Selected file size exceed {maxFileSize / 1024 / 1024} MB
										</span>
									)}
									{errors.resolution && (
										<span className="text-red-500 text-sm">
											Selected file is not match your desired resolution
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
					<p className="text-sm text-gray-400">Favicons will be appear here</p>
					<button
						onClick={handleFaviconFetchManually}
						className={`outline-dashed h-8 w-8 flex items-center justify-center hover:opacity-80 transition-all ease-in-out duration-300 ml-1`}
					>
						<MdRefresh
							size={23}
							className="text-white"
						/>
					</button>
				</div>
			)
		}
	}

	return (
		<Dialog
			title={formTitle}
			onClose={quitFrom}
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
						className="absolute right-3 top-3 text-white transition-all duration-300 ease-in-out hover:opacity-50 cursor-pointer hover:animate-pulse"
						onClick={handleUrlCopy}
					/>
				</div>

				{/* GROUP */}
				<SelectDropDown />

				<FormButtons
					handleCancel={quitFrom}
					handleDelete={handleBookmarkDelete}
					handleSubmit={handleSubmit}
					prevValue={bookmark?.url}
					value={url}
				/>
			</form>
		</Dialog>
	)
}

const SelectStyles: any = {
	control: (provided: any) => ({
		...provided,
		backgroundColor: "#00000000",
		borderRadius: 6,
		borderWidth: 0.5,
		borderColor: ["#757575", "#757575", "#757575", "#757575"],
	}),
	placeholder: (provided: any) => ({
		...provided,
		color: "#9c9c9c",
		borderColor: "#3f3f46",
	}),
	menu: (provided: any) => ({
		...provided,
		backgroundColor: "#1c1c1d",
		color: "#ffffff",
	}),
	option: (provided: any, state: any) => ({
		...provided,
		backgroundColor: state.isSelected ? "#3e4047" : "#1c1c1d",
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		color: "#ffffff",
	}),
	input: (provided: any) => ({
		...provided,
		borderColor: "#3f3f46",
		borderWidth: 0,
		color: "#ffffff",
	}),
	singleValue: (provided: any) => ({
		...provided,
		color: "#b9b9b9",
		borderColor: "#3f3f46",
	}),
}
