import { useSelector, useDispatch } from "react-redux"
import { editGroup } from "../redux/features/bookmarkSlice"

import Bookmark from "../components/Bookmark"
import BookmarkGroupList from "../components/BookmarkGroupList"

export default function Home() {
	const bookmarkGroups = useSelector((state: StoreRootState) => state.bookmarks)
	const dispatch = useDispatch()

	return (
		<main>
			{bookmarkGroups.map((bookmarkData) => (
				<BookmarkGroupList
					key={bookmarkData.id}
					title={bookmarkData.title}
					initGroupId={bookmarkData.id}
				>
					{bookmarkData.bookmarks.map((bookmark) => (
						<Bookmark
							key={bookmark.id}
							bookmark={bookmark}
						/>
					))}
				</BookmarkGroupList>
			))}
		</main>
	)
}
