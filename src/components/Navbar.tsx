import { IoMdSettings, IoMdMenu } from "react-icons/io"
import Divider from "./ui/Divider"

export default function Navbar() {
	return (
		<div className="group stick flex items-center justify-between w-full h-16 px-4 bg-gradient-to-r from-zinc-900 to-zinc-950">
			<h1 className="text-2xl font-bold text-white">Bookmark Hub</h1>

			<div className="flex items-center justify-center">
				<button className="flex items-center justify-center hover:opacity-50 hover:animate-pulse mr-3">
					<IoMdMenu
						size={30}
						className="text-white"
					/>
				</button>
				<button className="flex items-center justify-center hover:opacity-50 hover:animate-pulse">
					<IoMdSettings
						size={23}
						className="text-white"
					/>
				</button>
			</div>

			{/* //dropdown */}
			<div className="z-10 absolute right-10 top-10 flex flex-col items-center w-[130px] rounded-lg p-2 bg-zinc-700 transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible">
				<button className="flex w-full items-center hover:opacity-50 m-1">
					<p className="text-base text-left text-white">Add Bookmark</p>
				</button>
				<Divider />
				<button className="flex w-full items-center hover:opacity-50 m-1">
					<p className="text-base text-left text-white">Add Group</p>
				</button>
			</div>
		</div>
	)
}
