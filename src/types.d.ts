type Bookmarks = BookmarkGroup[]

interface BookmarkGroup {
	id: string
	title: string
	bookmarks: Bookmark[]
}

interface Bookmark {
	id: string
	title: string
	url: string
	favicon: string
	group: BookmarkStatus
}

type BookmarkStatus = "pinned" | "default"

interface StoreRootState {
	bookmarks: Bookmarks
}
