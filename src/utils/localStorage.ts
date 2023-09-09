export const getBookmarks = () => {
	const bookmarks = localStorage.getItem("bookmarks")
	if (bookmarks) {
		return JSON.parse(bookmarks)
	}
	return null
}

export const storeBookmarks = (bookmarks: BookmarkGroups) => {
	try {
		localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
	} catch (error) {
		console.error(error)		
	}
}
