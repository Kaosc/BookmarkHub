import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"

import Bookmark from "../components/sortable/Bookmark"
import Text from "../components/ui/Text"

export default function Search() {
	const bookmarkGroups = useSelector((state: RootState) => state.bookmarks)
	const search = useSelector((state: RootState) => state.search)
	const { headlineView } = useSelector((state: RootState) => state.settings)

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

	// Headline view: fill the LEFT column first, then the right one.
	const headlineColumns = useMemo(() => {
		if (!headlineView) return [[], []] as [Bookmark[], Bookmark[]]
		const mid = Math.ceil(filteredBookmarks.length / 2)
		return [
			filteredBookmarks.slice(0, mid),
			filteredBookmarks.slice(mid),
		] as [Bookmark[], Bookmark[]]
	}, [headlineView, filteredBookmarks])

	return (
		<div
			className={`flex-row overflow-y-auto top-0 left-0 z-30 w-full h-full p-[2px] bg-gradient-to-r from-zinc-200 to-zinc-50 dark:from-[#0e0e0e] dark:to-zinc-950  ${
				search ? "visible animate-in fade-in-0 duration-300" : "hidden animate-out fade-out-0 duration-300"
			}`}
		>
			{filteredBookmarks.length > 0 && (
				headlineView ? (
					<div className="flex flex-row items-start gap-2 p-1">
						{headlineColumns.map((column, colIndex) => (
							<div
								key={colIndex}
								className="flex flex-col items-start flex-1 min-w-0"
							>
								{column.map((bookmark) => (
									<Bookmark
										key={bookmark.id}
										bookmark={bookmark}
									/>
								))}
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-row flex-wrap items-start p-1">
						{filteredBookmarks.map((bookmark) => (
							<Bookmark
								key={bookmark.id}
								bookmark={bookmark}
							/>
						))}
					</div>
				)
			)}

			{filteredBookmarks.length === 0 && (
				<div className="flex flex-col w-full h-full items-center justify-center animate-in fade-in-0">
					<img
						src="assets/kitty-dark.png"
						alt="search"
						className="w-[150px] h-[150px] opacity-100 dark:opacity-40"
					/>
					<Text className="text-center text-lg">No bookmark found</Text>
				</div>
			)}
		</div>
	)
}
