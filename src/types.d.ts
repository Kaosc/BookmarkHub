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
}

type Form = {
	visible?: boolean
	initGroup?: GroupInfo
	mode: FormMode
	prevBookmark?: Bookmark | undefined
}

type GroupInfo = {
	id: string
	title: string
}

type FormMode = "addBookmark" | "editBookmark" | "addGroup" | "editGroup"
