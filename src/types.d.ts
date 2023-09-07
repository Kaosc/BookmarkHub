type BookmarkGroups = BookmarkData[]

interface BookmarkData {
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

type Form = {
	visible?: boolean
	groupId: string
	prevBookmark?: Bookmark
}

interface StoreRootState {
	bookmarks: BookmarkGroups
	form: Form
}
