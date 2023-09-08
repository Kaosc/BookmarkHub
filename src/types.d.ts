interface StoreRootState {
	bookmarks: BookmarkGroups
	form: Form
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
	group?: GroupInfo
	mode: FormMode
	prevBookmark?: Bookmark | undefined
}

type GroupInfo = {
	id: string
	title: string
}

type FormMode = "addBookmark" | "editBookmark" | "addGroup" | "editGroup"
