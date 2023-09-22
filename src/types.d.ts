interface RootState {
	bookmarks: BookmarkGroups
	search: string
	settings: Settings
	selection: SelectionState
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
	createdTime: number
	editedTime: number
	deleted?: boolean
}

type Settings = {
	visible: boolean
	theme: AppTheme
	showBookmarksTitle: boolean
	allowTwoLineTitle: boolean
}

type AppTheme = "light" | "dark" | "system"

type SelectionState = {
	selectionMode: boolean
	selectedGroup: string | null
	selectedBookmarks: Bookmark[] | []
}
