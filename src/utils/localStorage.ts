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

export const getSettings = () => {
	let settings = null

	try {
		settings = localStorage.getItem("settings")
	} catch (e) {
		console.error(e)
	}

	if (settings) {
		return JSON.parse(settings)
	}

	return null
}

export const storeSettings = (settings: Settings) => {
	try {
		localStorage.setItem("settings", JSON.stringify(settings))
	} catch (e) {
		console.error(e)
	}
}
