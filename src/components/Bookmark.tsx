import { memo, useRef, useState } from "react"
import { AiFillEdit } from "react-icons/ai"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useDispatch } from "react-redux"

import { setFormBookmark, toggleForm } from "../redux/features/formSlice"
import { editBookmark } from "../redux/features/bookmarkSlice"

import { cleanURL } from "../utils/cleanURL"
import { DUCK_FAVICON_API, GOOGLE_FAVICON_API, ICON_HORSE_API } from "../utils/constants"
import ActivityIndicator from "./ui/ActivityIndicator"

function Bookmark({
	group,
	bookmark,
	opacity = "opacity-100",
	className,
}: {
	group?: GroupInfo
	bookmark: Bookmark
	opacity?: string
	className?: React.HTMLAttributes<HTMLDivElement>["className"]
}) {
	const dispatch = useDispatch()
	
	const { id, title, url, favicon } = bookmark
	const [imageLoading, setImageLoading] = useState(true)

	// dnd-kit
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id })
	const style = { transform: CSS.Transform.toString(transform), transition }

	//////////////////////////////////////////////////////////////////
	////////////////// Recover favicon if not found //////////////////

	const imgReqSuccesAPI = useRef([
		{
			name: "google",
			endpoint: GOOGLE_FAVICON_API,
			success: false,
		},
		{
			name: "duck",
			endpoint: DUCK_FAVICON_API,
			success: false,
		},
		{
			name: "iconhorse",
			endpoint: ICON_HORSE_API,
			success: false,
		},
	])

	const handleOnImageLoadError = (e: any | undefined) => {
		if (!e) return

		const domain = cleanURL(e.currentTarget.src)
		let updatedSrc = url

		imgReqSuccesAPI.current.forEach((api) => {
			if (!api.success) {
				if (api.name === "google") {
					updatedSrc = `${api.name}${domain}&sz=128`
				} else if (api.name === "duck") {
					updatedSrc = `${api.name}${domain}.ico`
				} else if (api.name === "iconhorse") {
					updatedSrc = `${api.name}${domain}`
				}
			}
		})

		e.currentTarget.src = updatedSrc

		if (group?.id) {
			dispatch(
				editBookmark({
					bookmark: {
						...bookmark,
						favicon: updatedSrc,
					},
					groupId: group.id,
				}),
			)
		}
	}

	const handleOnImageLoaded = (e: any | undefined) => {
		setImageLoading(false)

		if (!e) return

		imgReqSuccesAPI.current.forEach((api) => {
			if (e.currentTarget.src.includes(api.name)) {
				api.success = true
			}
		})
	}

	////////////////// Recover favicon if not found //////////////////
	//////////////////////////////////////////////////////////////////

	const handleEditBookmark = () => {
		dispatch(setFormBookmark(bookmark))
		if (group)
			dispatch(toggleForm({ initGroup: { id: group?.id, title: group?.title }, mode: "editBookmark" }))
	}

	const redirect = () => {
		if (url) {
			try {
				if (!url.startsWith("https")) {
					window.open(`https://${url}`, "_blank")
					return
				} else {
					window.open(url, "_blank")
				}
			} catch (e) {
				alert("URL not valid")
			}
		}
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className={`group relative flex flex-col items-center justify-center hover:bg-zinc-900 
							p-1 w-[70px] my-2 mx-[1px] transition-all ${opacity}
							transition-all duration-500 ease-out animate-in fade-in-0 ${className}
							`}
		>
			<div className={`absolute flex invisible top-0 left-0 justify-end w-full group-hover:visible z-10`}>
				<button
					onClick={handleEditBookmark}
					className="p-1 text-white rounded-full hover:bg-gray-600 transition-all"
				>
					<AiFillEdit size={13} />
				</button>
			</div>

			<button
				onClick={redirect}
				className="flex flex-col justify-center items-center hover:scale-[1.04] transition-all hover:animate-pulse"
			>
				{imageLoading && <ActivityIndicator className={"w-[29px] h-[29px] text-white mb-[5px]"} />}

				<img
					src={favicon}
					alt={title}
					width={29}
					height={29}
					className={`mb-[5px] ${imageLoading && "hidden"}`}
					onError={handleOnImageLoadError}
					onLoad={handleOnImageLoaded}
				/>

				<p className="text-[11px] text-center text-white text-clip line-clamp-1 w-[60px]">{title}</p>
			</button>
		</div>
	)
}

export default memo(Bookmark)
