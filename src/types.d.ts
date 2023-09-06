type Bookmarks = BookmarkGroup[]

interface BookmarkGroup {
	id: string
	title: string
	bookmarks: Bookmark[]
}

type Bookmark = {
	id: string
	title: string
	url: string
	favicon: string
}

interface StoreRootState {
	bookmarks: Bookmarks
}
