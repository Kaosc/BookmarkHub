import { IoMdSettings, IoMdMenu } from "react-icons/io"
import { BsFillBookmarkFill } from "react-icons/bs"

import { useDispatch } from "react-redux"
import { toggleForm } from "../redux/features/formSlice"

import Divider from "./ui/Divider"

export default function Navbar() {
	const dispatch = useDispatch()

	const addBookmark = () => {
		dispatch(toggleForm({ group: { id: "default", title: "default" }, mode: "addBookmark" }))
	}

	const addGroup = () => {
		dispatch(toggleForm({ mode: "addGroup" }))
	}


	const texts = {
		addBookmark: "Add Bookmark",
		addGroup: "Add Group",
	}

	return (
		<div className="sticky flex items-center justify-between w-full h-16 px-4 bg-gradient-to-r from-zinc-900 to-zinc-950">
			<div className="flex items-center">
				<BsFillBookmarkFill
					size={20}
					className="text-white"
				/>
				<h1 className="text-2xl font-bold text-white ml-3">Search</h1>
			</div>

			<div className="group flex items-center justify-center">
				<button className="flex items-center justify-center hover:opacity-50 hover:animate-pulse mr-3">
					<IoMdMenu
						size={30}
						className="text-white"
					/>
				</button>

				{/* //dropdown */}
				<div
					className="z-10 absolute right-10 top-10 flex flex-col items-center w-[130px] rounded-lg p-2 bg-zinc-700 opacity-0
					transition-all duration-300 invisible group-hover:visible group-hover:opacity-100"
				>
					<button
						onClick={addBookmark}
						className="flex w-full items-center hover:opacity-50 m-1"
					>
						<p className="text-base text-left text-white">{texts.addBookmark}</p>
					</button>
					<Divider />
					<button
						onClick={addGroup}
						className="flex w-full items-center hover:opacity-50 m-1"
					>
						<p className="text-base text-left text-white">{texts.addGroup}</p>
					</button>
				</div>

				<button className="flex items-center justify-center hover:opacity-50 hover:animate-pulse">
					<IoMdSettings
						size={23}
						className="text-white"
					/>
				</button>
			</div>
		</div>
	)
}
