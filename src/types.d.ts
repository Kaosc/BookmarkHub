interface RootState {
	bookmarks: BookmarkGroups
	search: string
	settings: Settings
}

type BookmarkGroups = BookmarkData[]

interface BookmarkData {
	id: string
	title: string
	bookmarks: Bookmark[]
}

type GroupInfo = {
	id: string
	title: string
}

type Bookmark = {
	id: string
	title: string
	url: string
	favicon: string
	groupId: string
}

type Settings = {
	visible: boolean
	theme: string
	showBookmarksTitle: boolean
	allowTwoLineTitle: boolean
}
