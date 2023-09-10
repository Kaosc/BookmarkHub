import { useState, useEffect, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import ImageUploading, { ImageType } from "react-images-uploading"
import { nanoid } from "nanoid"
import Select from "react-select"

// Icons
import { BiCopy, BiUpload } from "react-icons/bi"
import { MdDeleteForever } from "react-icons/md"
import { IoMdAdd } from "react-icons/io"

import { addBookmark, deleteBookmark, editBookmark } from "../../redux/features/bookmarkSlice"

import Button from "../ui/Button"
import Dialog from "../Dialog"
import ActivityIndicator from "../ui/ActivityIndicator"

import { fetchFavicon } from "../../api/fetchFavicon"
import { faviconPlaceHolder } from "../../utils/constants"

export default function BookmarkForm({
	bookmark,
	groupIdToAdd,
	handleFormVisible,
}: {
	bookmark?: Bookmark
	groupIdToAdd?: string
	handleFormVisible: Function
}) {
	const bookmarkData = useSelector((state: RootState) => state.bookmarks)
	const dispatch = useDispatch()

	const bookmarkId = bookmark?.id || nanoid()
	const [favicon, setFavicon] = useState(bookmark?.favicon || "")
	const [title, setTitle] = useState(bookmark?.title || "")
	const [url, setUrl] = useState(bookmark?.url || "")
	const [group, setGroup] = useState({
		id: bookmark?.groupId || groupIdToAdd || "default",
		title: bookmarkData.find((bd) => bd.id === bookmark?.groupId)?.title,
	})

	const [loading, setLoading] = useState(false)
	const [faviconList, setFaviconList] = useState<string[]>([])

	const formTitle = bookmark ? "Edit Bookmark" : "Add Bookmark"
	const maxFileSize = 1024 * 1024 * 3
	const groupOptions: any = useMemo(
		() =>
			bookmarkData.map((bdg) => ({
				value: bdg.id,
				label: bdg.title,
			})),
		[bookmarkData],
	)

	useEffect(() => {
		if (url && !favicon?.startsWith("data")) {
			if (url !== bookmark?.url) {
				fetchFavicon(url).then((favicons) => {
					setFaviconList(favicons)
				})
			}
		} else {
			setFaviconList([])
		}
	}, [url, favicon, bookmark?.url])

	const handleFaviconChange = (imageList: ImageType[]) => setFavicon(imageList[0]?.dataURL || "")
	const handleGroupChange = (option: any) => setGroup({ id: option.value, title: option.label })
	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
	const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)

	const handleBookmarkAdd = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setLoading(true)

		let newBookmark: Bookmark = {
			id: bookmarkId,
			favicon: favicon || faviconList[faviconList.length - 1] || faviconPlaceHolder,
			title: title,
			url: url,
			groupId: group.id,
		}

		dispatch(addBookmark(newBookmark))
		quitFrom(e)
	}

	const handleBookmarkEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setLoading(true)

		let newBookmark: Bookmark = {
			id: bookmarkId,
			favicon: favicon,
			title: title,
			url: url,
			groupId: group.id,
		}

		// if (favicon.startsWith("data:image")) {
		// 	if (favicon !== prevBookmark?.favicon) {
		// 		bookmark.favicon = favicon
		// 	}
		// } else if ((favicon?.startsWith("data:image") && !favicon) || url !== prevBookmark?.url) {
		// 	bookmark.favicon = await fetchFavicon(url)
		// }
		
		dispatch(
			editBookmark({
				bookmark: newBookmark,
				prevGroupId: bookmark?.groupId !== newBookmark.groupId ? bookmark?.groupId : undefined,
			}),
		)

		quitFrom(e)
	}

	const handleBookmarkDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (!bookmark) return

		dispatch(deleteBookmark(bookmark))
		quitFrom(e)
	}

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()

		if (groupIdToAdd) {
			handleBookmarkAdd(e)
		} else {
			handleBookmarkEdit(e)
		}
	}

	const quitFrom = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		handleFormVisible()
		setLoading(false)
	}

	const SelectDropDown = useCallback(() => {
		return (
			<Select
				className="w-full mb-4"
				placeholder="Group"
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
						<div className="flex flex-col w-full items-center justify-between p-2 border-[0.5px] border-[#757575] px-3">
							<div className="flex w-full items-center justify-between">
								<div className="flex">
									{imageList[0]?.dataURL && (
										<div className="flex items-center justify-center">
											<img
												src={imageList[0]?.dataURL}
												alt="favicon-preview"
												className="w-12 h-12 rounded-full"
											/>
										</div>
									)}
									{!imageList[0]?.dataURL && (
										<div className="flex items-center">
											<Button
												onClick={onImageUpload}
												className={`outline-dashed ring-0 h-9 w-9`}
												{...{ type: "button" }}
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
											className={`groupId px-1 z-50 mr-2`}
											onClick={onImageUpload}
											{...{ type: "button" }}
										>
											<BiUpload
												size={20}
												className="text-white groupId-hover:text-black"
											/>
										</Button>
										<Button
											className={`groupId px-1 z-50`}
											onClick={onImageRemoveAll}
											{...{ type: "button" }}
										>
											<MdDeleteForever
												size={20}
												className="text-white groupId-hover:text-black"
											/>
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
								className="w-11 h-11  hover:opacity-50"
								onClick={() => setFavicon(favicon)}
							/>
						</div>
					))}
				</div>
			)
		} else {
			return null
		}
	}

	if (loading) {
		return <ActivityIndicator className={"my-7"} />
	} else {
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
						placeholder={"Title"}
						onChange={handleTitleChange}
					/>

					{/* URL */}
					<div className="relative flex w-full">
						<input
							value={url}
							required
							className="input pr-10"
							type="url"
							placeholder="URL*"
							onChange={handleUrlChange}
						/>
						<BiCopy
							size={22}
							className="absolute right-3 top-3 text-white transition-all duration-300 ease-in-out hover:opacity-50 cursor-pointer hover:animate-pulse"
							onClick={() => navigator.clipboard.writeText(url)}
						/>
					</div>

					{/* GROUP */}
					<SelectDropDown />

					<div className="flex justify-between w-full mt-2">
						{/* DELETE */}
						<Button
							className={`px-[10px] text-red-600 rin-1 ring-red-600 rounded-md hover:bg-red-600 hover:text-white`}
							onClick={handleBookmarkDelete}
							type="button"
						>
							<MdDeleteForever size={20} />
						</Button>

						<div className="flex w-full items-center justify-end">
							{/* CANCEL */}
							<Button
								className={`mr-3`}
								onClick={quitFrom}
								type="button"
							>
								<p>Cancel</p>
							</Button>

							{/* EDIT & ADD */}
							<Button
								onClick={(e) => url && handleSubmit(e)}
								type="submit"
							>
								<p>{bookmark ? "Save" : "Add"}</p>
							</Button>
						</div>
					</div>
				</form>
			</Dialog>
		)
	}
}

const SelectStyles: any = {
	control: (provided: any) => ({
		...provided,
		backgroundColor: "#00000000",
		borderRadius: 0,
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
		backgroundColor: "#2a2a2e",
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
	valueContainer: (provided: any) => ({
		...provided,
		backgroundColor: "#00000000",
		color: "#ffffff",
	}),
	container: (provided: any) => ({
		...provided,
		color: "#ffffff",
		borderColor: "#3f3f46",
	}),
	indicatorsContainer: (provided: any) => ({
		...provided,
		backgroundColor: "#00000000",
		color: "#ffffff",
	}),
}
