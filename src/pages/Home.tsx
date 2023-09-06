import { useSelector } from "react-redux"
import BookmarkGroup from "../components/BookmarkGroup"
import Bookmark from "../components/Bookmark"

export default function Home() {
	const bookmarks = useSelector((state: StoreRootState) => state.bookmarks)
	return (
		<main>
			{bookmarks.map((bookmarkGroup, index) => (
				<BookmarkGroup
					key={index}
					title={bookmarkGroup.title}
					initGroupId={bookmarkGroup.id}
				>
					{bookmarkGroup.bookmarks.map((bookmark) => (
						<Bookmark
							key={bookmark.id}
							bookmark={bookmark}
						/>
					))}
				</BookmarkGroup>
			))}
		</main>
	)
}
