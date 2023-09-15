import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import Bookmark from "../components/sortable/Bookmark"
import Text from "../components/ui/Text"

export default function Search() {
	const bookmarkGroups = useSelector((state: RootState) => state.bookmarks)
	const search = useSelector((state: RootState) => state.search)

	const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([])

	useEffect(() => {
		if (search) {
			const filtered: Bookmark[] = []

			bookmarkGroups.forEach((group) => {
				group.bookmarks.forEach((bookmark) => {
					if (
						bookmark.title.toLowerCase().includes(search.toLowerCase()) ||
						bookmark.url.toLowerCase().includes(search.toLowerCase())
					) {
						filtered.push(bookmark)
					}
				})
			})

			setFilteredBookmarks(filtered)
		} else {
			setFilteredBookmarks([])
		}
	}, [search, bookmarkGroups])

	return (
		<div
			className={`absolute top-0 left-0 z-10 mt-14 w-[435px] h-[494px] 
				bg-gradient-to-r from-zinc-200 to-zinc-50 dark:from-[#0e0e0e] dark:to-zinc-950 
				${search ? "visible animate-in fade-in-0 duration-300" : "invisible animate-out fade-out-0 duration-300"} 
			`}
		>
			{filteredBookmarks.length > 0 && (
				<div className="flex flex-row flex-wrap items-start justify-start">
					{filteredBookmarks.map((bookmark) => (
						<Bookmark
							key={bookmark.id}
							bookmark={bookmark}
						/>
					))}
				</div>
			)}

			{filteredBookmarks.length === 0 && (
				<div className="flex flex-col w-full h-full items-center justify-center animate-in fade-in-0">
					<img
						src="assets/kitty-dark.png"
						alt="search"
						className="w-[150px] h-[150px]"
					/>
					<Text className="text-center text-lg">No bookmark found</Text>
				</div>
			)}
		</div>
	)
}
