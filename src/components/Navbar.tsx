import { IoMdSettings, IoMdMenu } from "react-icons/io"
import { BsFillBookmarkFill } from "react-icons/bs"

import { useDispatch } from "react-redux"
import { toggleForm } from "../redux/features/formSlice"

import Divider from "./ui/Divider"
import SearchBar from "./SearchBar"

export default function Navbar() {
	const dispatch = useDispatch()

	const addBookmark = () => {
		dispatch(toggleForm({ prevGroup: { id: "default", title: "default" }, mode: "addBookmark" }))
	}

	const addGroup = () => {
		dispatch(toggleForm({ mode: "addGroup" }))
	}

	const texts = {
		addBookmark: "Add Bookmark",
		addGroup: "Add Group",
	}

	return (
		<div className="z-20 sticky flex items-center justify-between w-full h-16 px-4 bg-gradient-to-r from-zinc-900 to-zinc-950">
			<div className="flex items-center justify-center">
				<BsFillBookmarkFill
					size={23}
					className="text-white  mr-3"
				/>
				<SearchBar />
			</div>

			<div className="flex items-center justify-center">
				<div className="group">
					<button className="flex items-center justify-center hover:opacity-50 hover:animate-pulse mr-3">
						<IoMdMenu
							size={30}
							className="text-white"
						/>
					</button>

					{/* dropdown */}
					<div
						className="absolute right-[52px] top-10 flex flex-col items-center w-[130px] rounded-lg p-2 bg-gradient-to-tr from-zinc-900 to-zinc-800 opacity-0
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
