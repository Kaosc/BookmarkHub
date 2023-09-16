import React from "react"
import { useDispatch } from "react-redux"

import { BiSearchAlt2 } from "react-icons/bi"
import { IoIosClose } from "react-icons/io"

import { setSearch } from "../redux/features/searchSlice"

export default function SearchBar() {
	const dispatch = useDispatch()

	const [visible, setVisible] = React.useState(false)
	const inputRef = React.useRef<HTMLInputElement>(null)

	const onTextChange = () => {
		if (inputRef.current?.value) setVisible(true)
		else setVisible(false)

		dispatch(setSearch(inputRef.current?.value))
	}

	const clearInput = () => {
		if (inputRef.current) {
			inputRef.current.blur()
			inputRef.current.value = ""
			setVisible(false)
		}
		dispatch(setSearch(""))
	}

	return (
		<div
			className="
				relative flex flex-row w-48 h-8 items-center justify-center rounded-full focus:ring-2 
				bg-[#dddddd6c] dark:bg-[#1B1B1C] hover:dark:bg-zinc-800 hover:bg-slate-200 focus:ring-slate-500 basedShadow
				focus:ring-opacity-50 transition-all ease-in-out duration-300
			"
		>
			<div className="absolute left-3 bottom-[5px] hover:scale-110 transition-all ease-in-out">
				<BiSearchAlt2
					size={19}
					className="text-black dark:text-white hover:text-white"
				/>
			</div>
			<input
				className="ml-[37px] mr-9 overflow-hidden dark:text-gray-300 text-[#242424] text-base outline-none bg-transparent"
				ref={inputRef}
				required
				autoFocus={true}
				onChange={onTextChange}
				name="search"
				placeholder="Search"
			/>
			{visible && (
				<button
					className="absolute right-1 hover:scale-110 transition-all ease-in-out"
					onClick={clearInput}
					title="Clear Search"
				>
					<IoIosClose
						size={30}
						className="text-black dark:text-white hover:text-white"
					/>
				</button>
			)}
		</div>
	)
}
