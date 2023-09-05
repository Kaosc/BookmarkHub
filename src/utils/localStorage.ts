export const getBookmarks = () => {
	const bookmarks = localStorage.getItem("bookmarks")
	if (bookmarks) {
		return JSON.parse(bookmarks)
	}
	return []
}

export const storeBookmarks = (bookmarks: Bookmarks) => {
	localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
}
