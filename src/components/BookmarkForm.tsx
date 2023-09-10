import React, { useEffect, useState, useCallback } from "react"
import Select from "react-select"
import { nanoid } from "nanoid"
import ImageUploading from "react-images-uploading"
import { ImageType } from "react-images-uploading/dist/typings"
import { useDispatch, useSelector } from "react-redux"
import { resetFrom } from "../redux/features/formSlice"
import {
	addBookmark,
	addGroup,
	deleteBookmark,
	deleteGroup,
	editBookmark,
	editGroupTitle,
} from "../redux/features/bookmarkSlice"

import { BiCopy, BiUpload } from "react-icons/bi"
import { MdDeleteForever } from "react-icons/md"
import { IoMdAdd, IoMdClose } from "react-icons/io"

import Button from "./ui/Button"
import ActivityIndicator from "./ui/ActivityIndicator"
import { faviconPlaceHolder } from "../utils/constants"
import { fetchFavicon } from "../api/fetchFavicon"

export default function BookmarkForm() {
	const dispatch = useDispatch()
	const bookmarkGroups = useSelector((state: RootState) => state.bookmarks)
	const { visible, prevBookmark, mode, prevGroup } = useSelector((state: RootState) => state.form)

	// FORM STATES
	const [favicon, setUploadedFavicon] = useState("")
	const [bookmarkDataGroup, setBookmarkDataGroup] = useState({ id: "", title: "" })
	const [group, setGroup] = useState({ id: "default", title: "Default" })
	const [title, setTitle] = useState("")
	const [url, setUrl] = useState("")

	const [loading, setLoading] = useState(false)
	// const [isSelectInputFocused, setIsSelectInputFocused] = useState(false)
	const maxFileSize = 1024 * 1024 * 3

	useEffect(() => {
		const handleKeydown = (e: KeyboardEvent) => e.key === "Enter" && e.preventDefault()
		window.addEventListener("keydown", handleKeydown)
		return () => window.removeEventListener("keydown", handleKeydown)
	}, [])

	useEffect(() => {
		if ((mode === "addGroup" || mode === "editGroup") && prevGroup) {
			setBookmarkDataGroup(mode === "addGroup" ? { id: "", title: "" } : prevGroup)
		}

		if (prevBookmark) {
			setGroup({
				id: prevBookmark.group,
				title: bookmarkGroups.find((bd) => bd.id === prevBookmark.group)?.title || "Default",
			})
			setUrl(prevBookmark.url)
			setTitle(prevBookmark?.title)
			setUploadedFavicon(prevBookmark?.favicon)
		}

		return () => {
			setGroup({ id: "default", title: "Default" })
			setTitle("")
			setUrl("")
			setUploadedFavicon("")
			setBookmarkDataGroup({ id: "", title: "" })
		}
	}, [visible, mode, prevBookmark, bookmarkGroups, prevGroup])

	////////////////////////// FORM CHANGE //////////////////////////

	const handleNewGroupTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setBookmarkDataGroup((prev) => ({ ...prev, title: e.target.value }))
	}

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value)
	}

	const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setUrl(e.target.value)
	}

	const handleGroupSelect = (option: any) => {
		setGroup({ id: option.value, title: option.label })
	}

	////////////////////////// FAVICON CHANGE ////////////////////////

	const handleFaviconChange = (imageList: ImageType[]) => {
		setUploadedFavicon(imageList[0]?.dataURL || "")
	}

	////////////////////////// GROUP SUBMIT //////////////////////////

	const handleGroupTitleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		dispatch(editGroupTitle({ id: bookmarkDataGroup.id || "default", title: bookmarkDataGroup.title }))
		quitFrom(e)
	}

	const handleGroupSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		dispatch(addGroup({ id: nanoid(), title: bookmarkDataGroup.title, bookmarks: [] }))
		quitFrom(e)
	}

	const handleGroupDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		dispatch(deleteGroup(bookmarkDataGroup.id))
		quitFrom(e)
	}

	////////////////////////// BOOKMARK SUBMIT //////////////////////////

	const handleBookmarkEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!prevBookmark) return

		e.preventDefault()
		setLoading(true)

		let bookmark: Bookmark = {
			id: prevBookmark.id,
			favicon: prevBookmark.favicon,
			title: title,
			url: url,
			group: group.id,
		}

		// If user uploaded a favicon, check for changes & update favicon
		if (favicon.startsWith("data:image")) {
			if (favicon !== prevBookmark?.favicon) {
				bookmark.favicon = favicon
			}
		} else if ((favicon?.startsWith("data:image") && !favicon) || url !== prevBookmark?.url) {
			bookmark.favicon = await fetchFavicon(url)
		}

		// Update bookmark
		dispatch(
			editBookmark({
				bookmark: bookmark,
				movedFromId: group.id !== prevBookmark.group ? prevBookmark.group : undefined,
			}),
		)

		quitFrom(e)
	}

	const handleBookmarkSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setLoading(true)

		let bookmark: Bookmark = {
			id: nanoid(),
			favicon: faviconPlaceHolder,
			title: title,
			url: url,
			group: group.id,
		}

		bookmark.favicon = favicon || (await fetchFavicon(url))

		dispatch(addBookmark(bookmark))
		quitFrom(e)
	}

	const handleBookmarkDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		dispatch(deleteBookmark({ bookmarkId: prevBookmark?.id ?? "", groupId: group?.id ?? "default" }))
		quitFrom(e)
	}

	////////////////////////// BUTTONS //////////////////////////

	const submit = (_: React.MouseEvent<HTMLButtonElement>) => {
		_.preventDefault()
		switch (mode) {
			case "addGroup":
				handleGroupSubmit(_)
				break
			case "editGroup":
				handleGroupTitleEdit(_)
				break
			case "addBookmark":
				handleBookmarkSubmit(_)
				break
			case "editBookmark":
				handleBookmarkEdit(_)
				break
			default:
				break
		}
	}

	const remove = (_: React.MouseEvent<HTMLButtonElement>) => {
		_.preventDefault()
		switch (mode) {
			case "editBookmark":
				handleBookmarkDelete(_)
				break
			case "editGroup":
				handleGroupDelete(_)
				break
			default:
				break
		}
	}

	const quitFrom = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		dispatch(resetFrom())
		setLoading(false)
	}

	////////////////////////// COMPONENTS //////////////////////////

	const FromTitle = useCallback(() => {
		let formTitle = ""

		if (mode === "addBookmark") formTitle = "Add Bookmark"
		if (mode === "editBookmark") formTitle = "Edit Bookmark"
		if (mode === "addGroup") formTitle = "Add Group"
		if (mode === "editGroup") formTitle = "Edit Group"

		if (loading) formTitle = "Retrieving favicon..."

		return <h1 className="text-2xl text-white font-bold mb-4">{formTitle}</h1>
	}, [mode, loading])

	const SelectDropDown = useCallback(() => {
		return (
			<Select
				className="w-full mb-4"
				placeholder="Group"
				// onMenuOpen={() => totalGroupLen >= 3 && setIsSelectInputFocused(true)}
				// onMenuClose={() => totalGroupLen >= 3 && setIsSelectInputFocused(false)}
				isSearchable={true}
				value={{ value: group.id, label: group.title }}
				onChange={handleGroupSelect}
				options={bookmarkGroups.map((bookmarkDataGroup) => ({
					value: bookmarkDataGroup.id,
					label: bookmarkDataGroup.title,
				}))}
				theme={(theme: any) => ({
					...theme,
					colors: {
						...theme.colors,
						primary25: "#575757",
						primary: "#46474d",
						primary50: "#202020",
					},
				})}
				styles={{
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
				}}
			/>
		)
	}, [bookmarkGroups, group])

	const ImageUploadSection = () => {
		if (mode === "addBookmark" || mode === "editBookmark") {
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
												className={`group px-1 z-50 mr-2`}
												onClick={onImageUpload}
												{...{ type: "button" }}
											>
												<BiUpload
													size={20}
													className="text-white group-hover:text-black"
												/>
											</Button>
											<Button
												className={`group px-1 z-50`}
												onClick={onImageRemoveAll}
												{...{ type: "button" }}
											>
												<MdDeleteForever
													size={20}
													className="text-white group-hover:text-black"
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
		} else {
			return null
		}
	}

	return (
		<div
			className={`absolute items-center justify-center flex-col w-[430px] h-[550px] z-20 bg-[#000000af] transition-all ease-in-out  ${
				visible ? "flex" : "hidden"
			} `}
		>
			<div
				className={`flex w-full items-center justify-center transition-all ease-in-out 
				${/* isSelectInputFocused ? "translate-y-[-22%] duration-300" : "translate-y-0 duration-300" */ ""}
				`}
			>
				<div
					className={`relative flex-col w-3/4 bg-gradient-to-tr from-zinc-900 to-zinc-800 p-5 rounded-lg
									animate-in fade-in-0 slide-in-from-top-20 duration-300 `}
				>
					<button
						className="absolute top-3 right-3 text-white hover:opacity-50 hover:animate-pulse cursor-pointer"
						onClick={quitFrom}
					>
						<IoMdClose
							className=""
							size={30}
						/>
					</button>

					<FromTitle />
					{loading ? (
						<ActivityIndicator className={"my-7"} />
					) : (
						<>
							<ImageUploadSection />
							<form className="flex flex-col items-center">
								{(mode === "editGroup" || mode === "addGroup") && (
									<input
										value={bookmarkDataGroup.title}
										className="input"
										type="text"
										placeholder={"Group Title"}
										onChange={handleNewGroupTitleChange}
									/>
								)}
								{(mode === "addBookmark" || mode === "editBookmark") && (
									<>
										<input
											value={title}
											className="input"
											type="text"
											placeholder={"Title"}
											onChange={handleTitleChange}
										/>
										<div className="relative flex w-full">
											<input
												value={url}
												required
												className="input"
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
										<SelectDropDown />
									</>
								)}
								<div className="flex justify-between w-full mt-2">
									{/* DELETE */}
									{mode.includes("edit") && (
										<Button
											className={`px-[10px] text-red-600 rin-1 ring-red-600 rounded-md hover:bg-red-600 hover:text-white`}
											onClick={remove}
											{...{ type: "button" }}
										>
											<MdDeleteForever size={20} />
										</Button>
									)}
                           
									<div className="flex w-full items-center justify-end">
										{/* CANCEL */}
										<Button
											className={`mr-3`}
											onClick={quitFrom}
											{...{ type: "reset" }}
										>
											<p>Cancel</p>
										</Button>

										{/* EDIT & ADD */}
										<Button
											onClick={(e) => url && submit(e)}
											props={{ type: "submit" }}
										>
											<p>{mode.includes("edit") ? "Save" : "Add"}</p>
										</Button>
									</div>
								</div>
							</form>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
