import React from "react"
import Select from "react-select"
import { nanoid } from "nanoid"
import { getLinkPreview } from "link-preview-js"

import { useDispatch, useSelector } from "react-redux"
import { addBookmark, editBookmark } from "../redux/features/bookmarkSlice"

import { iconPlaceHolder } from "../utils/constants"
import { setGroupId, toggleForm } from "../redux/features/formSlice"

export default function BookmarkForm() {
	const { visible, groupId, prevBookmark } = useSelector((state: StoreRootState) => state.form)
	const bookmarks = useSelector((state: StoreRootState) => state.bookmarks)
	const dispatch = useDispatch()

	const [title, setTitle] = React.useState(prevBookmark?.title || "")
	const [url, setUrl] = React.useState(prevBookmark?.url || "")
	const [loading, setLoading] = React.useState(false)

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value)
	}

	const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUrl(e.target.value)
	}

	const handleGroupChange = (option: any) => {
		dispatch(setGroupId({ groupId: option.value }))
	}

	const fetchFavicon = async (url: string): Promise<string> => {
		let favicon = require("../assets/placeholder-favicon.png")

		if (!url.startsWith("http") || !url.startsWith("https")) return favicon

		try {
			await getLinkPreview(url, {
				headers: {
					"user-agent": "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)",
					"Access-Control-Allow-Origin": "*",
				},
				proxyUrl: "https://cors-anywhere.herokuapp.com/",
				imagesPropertyType: "og",
				followRedirects: "follow",
				timeout: 10000,
			}).then((data) => {
				if (data.favicons.length > 1) {
					favicon = data.favicons[-1]
				} else {
					favicon = data.favicons[0]
				}
			})
		} catch (error) {
			console.log(error)
		}

		return favicon
	}

	const handleEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setLoading(true)

		let bookmark: Bookmark = {
			id: prevBookmark?.id || nanoid(),
			favicon: prevBookmark?.favicon || iconPlaceHolder,
			title: title,
			url: url,
		}

		if (prevBookmark?.url !== url) {
			bookmark.favicon = await fetchFavicon(url)
		}

		dispatch(editBookmark({ bookmark: bookmark, groupId: groupId }))
		quitFrom()
	}

	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setLoading(true)

		let bookmark: Bookmark = {
			id: nanoid(),
			favicon: iconPlaceHolder,
			title: title,
			url: url,
		}

		bookmark.favicon = await fetchFavicon(url)

		dispatch(addBookmark({ bookmark: bookmark, groupId: groupId }))
		quitFrom()
	}

	const quitFrom = () => {
		setTitle("")
		setUrl("")
		dispatch(toggleForm({ groupId: "default-group" }))
		setLoading(false)
	}

	return (
		<div
			className={`absolute flex-col bg-[#000000af] items-center justify-center w-[430px] h-[550px] z-20 ${
				visible ? "flex" : "hidden"
			}`}
		>
			<div className="flex flex-col w-3/4 bg-gradient-to-b from-zinc-700 to-zinc-800 p-5 rounded-lg">
				<h1 className="text-2xl text-white font-bold mb-4">
					{loading ? "Hold on a sec..." : "Add Bookmark"}
				</h1>
				{loading ? (
					<div className="flex flex-col items-center justify-center my-7">
						<div className="animate-spin rounded-full h-14 w-14 border-b-4 border-gray"></div>
					</div>
				) : (
					<form className="flex flex-col items-center justify-center">
						<input
							value={title}
							className="w-full h-11 mb-4 bg-transparent transition-all duration-300 ease-in-out text-white
                        border-[0.5px] border-[#757575] outline-none pl-2 
                        hover:border-white
                        focus:scale-[1.02] focus:border-white"
							type="text"
							placeholder="Title"
							onChange={handleTitleChange}
						/>
						<input
							value={url}
							className="w-full h-11  mb-4 bg-transparent transition-all duration-300 ease-in-out text-white
                        border-[0.5px] border-[#757575] outline-none pl-2 
                        hover:border-white
                        focus:scale-[1.02] focus:border-white"
							type="url"
							placeholder="URL"
							onChange={handleUrlChange}
						/>
						<Select
							className="w-full mb-6"
							onChange={handleGroupChange}
							placeholder="Group"
							options={bookmarks.map((bookmarkGroup) => {
								return { value: bookmarkGroup.id, label: bookmarkGroup.title }
							})}
							theme={(theme) => ({
								...theme,
								colors: {
									...theme.colors,
									primary25: "#6b6b6b",
									primary: "#a5a5a5",
								},
							})}
							styles={{
								control: (provided) => ({
									...provided,
									backgroundColor: "#3f3f46",
									borderRadius: 0,
									borderWidth: 0,
								}),
								placeholder: (provided) => ({
									...provided,
									color: "#ffffff",
									borderColor: "#3f3f46",
								}),
								menu: (provided) => ({
									...provided,
									backgroundColor: "#3f3f46",
									color: "#ffffff",
								}),
								input: (provided) => ({
									...provided,
									borderColor: "#3f3f46",
									borderWidth: 0,
								}),
								singleValue: (provided) => ({
									...provided,
									color: "#ffffff",
									borderColor: "#3f3f46",
								}),
								valueContainer: (provided) => ({
									...provided,
									backgroundColor: "#3f3f46",
									color: "#ffffff",
									borderWidth: 0,
								}),
								container: (provided) => ({
									...provided,
									backgroundColor: "#3f3f46",
									color: "#ffffff",
									borderColor: "#3f3f46",
								}),
								indicatorsContainer: (provided) => ({
									...provided,
									backgroundColor: "#3f3f46",
									color: "#ffffff",
								}),
							}}
						/>
						<div className="flex w-full items-center justify-end">
							<button
								className="ring-1 ring-[#a5a5a5] rounded-md px-4 py-1 text-[#a5a5a5] hover:bg-[#cecece] hover:text-black transition-all duration-100 ease-in-out mr-3"
								type="reset"
								onClick={quitFrom}
							>
								Cancel
							</button>
							<button
								className="ring-1 ring-white rounded-md px-4 py-1 text-white hover:bg-[#cecece] hover:text-black transition-all duration-100 ease-in-out"
								type="submit"
								onClick={prevBookmark ? handleEdit : handleSubmit}
							>
								{prevBookmark ? "Save" : "Add"}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	)
}
