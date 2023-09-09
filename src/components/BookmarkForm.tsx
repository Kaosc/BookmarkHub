import React, { useEffect, useState, useCallback } from "react"
import Select from "react-select"
import { nanoid } from "nanoid"
import { MdDeleteForever } from "react-icons/md"
import ImageUploading from "react-images-uploading"
import { ImageType } from "react-images-uploading/dist/typings"
import { BiCopy, BiUpload } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import {
	addBookmark,
	addGroup,
	deleteBookmark,
	deleteGroup,
	editBookmark,
	editGroupTitle,
	moveBookmark,
} from "../redux/features/bookmarkSlice"

import { faviconPlaceHolder } from "../utils/constants"
import { resetFrom } from "../redux/features/formSlice"
import Button from "./ui/Button"
import { fetchFavicon } from "../api/fetchFavicon"
import { IoMdAdd } from "react-icons/io"
import ActivityIndicator from "./ui/ActivityIndicator"
export default function BookmarkForm() {
	const bookmarks = useSelector((state: StoreRootState) => state.bookmarks)
	const { visible, initGroup, prevBookmark, mode } = useSelector((state: StoreRootState) => state.form)

	// FORM STATES
	const [favicon, setUploadedFavicon] = useState("")
	const maxFileSize = 1024 * 1024 * 3

	const [group, setGroup] = useState({ id: "", title: "" })

	const [title, setTitle] = useState("")
	const [url, setUrl] = useState("")

	const [loading, setLoading] = useState(false)
	const [isSelectInputFocused, setIsSelectInputFocused] = useState(false)

	const dispatch = useDispatch()

	useEffect(() => {
		setUploadedFavicon(prevBookmark?.favicon || "")
		setGroup({
			id: mode === "addGroup" ? "" : initGroup?.id || "default",
			title:
				mode === "addGroup"
					? ""
					: initGroup?.id === "default"
					? initGroup?.id
					: initGroup?.title || "default",
		})
		setTitle(prevBookmark?.title || "")
		setUrl(prevBookmark?.url || "")

		return () => {
			setGroup({ id: "", title: "" })
			setTitle("")
			setUrl("")
			setUploadedFavicon("")
		}
	}, [visible, initGroup, prevBookmark, mode])

	////////////////////////// FORM CHANGE //////////////////////////

	const handleNewGroupTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setGroup((prev) => ({ ...prev, title: e.target.value }))
	}

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value)
	}

	const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUrl(e.target.value)
	}

	const handleGroupSelect = (option: any) => {
		setGroup({ id: option.value, title: option.label })
	}

	////////////////////////// FAVICON CHANGE ////////////////////////

	const handleFaviconChange = (imageList: ImageType[]) => {
		setUploadedFavicon(imageList[0]?.dataURL || "")
	}

	////////////////////////// FORM SUBMIT //////////////////////////

	const handleGroupTitleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		dispatch(editGroupTitle({ id: group.id || "default", title: group.title }))
		quitFrom()
	}

	const handleGroupSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		dispatch(addGroup({ id: nanoid(), title: group.title, bookmarks: [] }))
		quitFrom()
	}

	const handleGroupDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		dispatch(deleteGroup(group.id))
		quitFrom()
	}

	////////////////////////// BOOKMARK SUBMIT //////////////////////////

	const handleBookmarkEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setLoading(true)

		let bookmark: Bookmark = {
			id: prevBookmark?.id || nanoid(),
			favicon: prevBookmark?.favicon || faviconPlaceHolder,
			title: title,
			url: url,
		}

		// If user uploaded a favicon, check for changes & update favicon
		if (favicon.startsWith("data:image")) {
			if (favicon !== prevBookmark?.favicon) {
				bookmark.favicon = favicon
			}
			// If user didn't upload a favicon, check for url changes & update favicon
		} else if ((!favicon?.startsWith("data:image") && url !== prevBookmark?.url) || !favicon) {
			bookmark.favicon = await fetchFavicon(url)
		}

		// Update bookmark
		dispatch(editBookmark({ bookmark: bookmark, groupId: group.id ?? "default" }))

		// Check is bookmark moved to another group
		if (initGroup?.id !== group?.id) {
			dispatch(
				moveBookmark({
					bookmarkId: prevBookmark?.id ?? "",
					groupId: initGroup?.id ?? "default",
					toGroupId: group.id,
				}),
			)
		}

		quitFrom()
	}

	const handleBookmarkSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setLoading(true)

		let bookmark: Bookmark = {
			id: nanoid(),
			favicon: faviconPlaceHolder,
			title: title,
			url: url,
		}

		bookmark.favicon = favicon || (await fetchFavicon(url))

		dispatch(addBookmark({ bookmark: bookmark, groupId: group?.id ?? "default" }))
		quitFrom()
	}

	const handleBookmarkDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		dispatch(deleteBookmark({ bookmarkId: prevBookmark?.id ?? "", groupId: group?.id ?? "default" }))
		quitFrom()
	}

	////////////////////////// BUTTONS //////////////////////////

	const submit = (_: React.MouseEvent<HTMLButtonElement>) => {
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

	const quitFrom = () => {
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

	const SelectDropDown = () => {
		return (
			<Select
				className="w-full mb-4"
				placeholder="Group"
				onMenuOpen={() => setIsSelectInputFocused(true)}
				onMenuClose={() => setIsSelectInputFocused(false)}
				isSearchable={true}
				value={{ value: group.id, label: group.title }}
				onChange={handleGroupSelect}
				options={bookmarks.map((bookmarkGroup) => ({
					value: bookmarkGroup.id,
					label: bookmarkGroup.title,
				}))}
				theme={(theme: any) => ({
					...theme,
					colors: {
						...theme.colors,
						primary25: "#6b6b6b",
						primary: "#a5a5a5",
					},
				})}
				styles={{
					control: (provided: any) => ({
						...provided,
						backgroundColor: "#3f3f46",
						borderRadius: 0,
						borderWidth: 0,
					}),
					placeholder: (provided: any) => ({
						...provided,
						color: "#9c9c9c",
						borderColor: "#3f3f46",
					}),
					menu: (provided: any) => ({
						...provided,
						backgroundColor: "#3f3f46",
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
						backgroundColor: "#3f3f46",
						color: "#ffffff",
						borderWidth: 0,
					}),
					container: (provided: any) => ({
						...provided,
						backgroundColor: "#3f3f46",
						color: "#ffffff",
						borderColor: "#3f3f46",
					}),
					indicatorsContainer: (provided: any) => ({
						...provided,
						backgroundColor: "#3f3f46",
						color: "#ffffff",
					}),
				}}
			/>
		)
	}

	const FormButtons = () => {
		return (
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
						onClick={submit}
						props={{ type: "submit" }}
					>
						<p>{mode.includes("edit") ? "Save" : "Add"}</p>
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div
			className={`absolute items-center justify-center flex-col w-[430px] h-[550px] z-20 transition-al ease-in-out bg-[#000000af]  ${
				visible ? "flex" : "hidden"
			} `}
		>
			<div
				className={`flex w-full items-center justify-center transition-all ease-in-out ${
					isSelectInputFocused ? "translate-y-[-40%] duration-300" : "translate-y-0 duration-300"
				}`}
			>
				<div
					className={`animate-in fade-in-0 slide-in-from-top-20 duration-300 flex-col w-3/4 bg-gradient-to-tr from-zinc-900 to-zinc-800 p-5 rounded-lg`}
				>
					<FromTitle />
					{loading ? (
						<ActivityIndicator className={"my-7"} />
					) : (
						<>
							{(mode === "addBookmark" || mode === "editBookmark") && (
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
																{!errors && (
																	<p className="text-sm text-gray-400 ml-3">Upload Favicon (optional)</p>
																)}
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
															<span className="text-red-500 text-sm">
																Number of selected images exceed maxNumber
															</span>
														)}
														{errors.acceptType && (
															<span className="text-red-500 text-sm">
																Your selected file type is not allow
															</span>
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
							)}
							<form className="flex flex-col items-center">
								{(mode === "editGroup" || mode === "addGroup") && (
									<input
										value={group.title}
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
												className="input required:ring-1 required:ring-red-600 pr-11"
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
								<FormButtons />
							</form>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
