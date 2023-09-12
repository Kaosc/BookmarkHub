export const getBookmarks = () => {
	let bookmarks = null

	try {
		bookmarks = localStorage.getItem("bookmarks")
	} catch (e) {
		console.error(e)
	}

	if (bookmarks) {
		return JSON.parse(bookmarks)
	}

	return null
}

export const storeBookmarks = (bookmarks: BookmarkGroups) => {
	try {
		localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
	} catch (e) {
		console.error(e)
	}
}
