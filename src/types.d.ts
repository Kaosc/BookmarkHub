interface RootState {
	bookmarks: BookmarkGroups
	form: Form
	search: string
}

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
	groupId: string
}

type GroupInfo = {
	id: string
	title: string
}
