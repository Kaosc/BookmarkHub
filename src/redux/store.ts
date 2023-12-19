import { configureStore } from "@reduxjs/toolkit"

import { bookmarksSlice } from "./features/bookmarkSlice"
import { searchSlice } from "./features/searchSlice"
import { settingsSlice } from "./features/settingsSlice"
import { selectionSlice } from "./features/selectionSlice"

import { storeBookmarks, storeSettings } from "../utils/localStorage"

export const store = configureStore({
	reducer: {
		bookmarks: bookmarksSlice.reducer,
		search: searchSlice.reducer,
		settings: settingsSlice.reducer,
		selection: selectionSlice.reducer,
	},
})

store.subscribe(() => {
	const state = store.getState()

	const bookmarks = state.bookmarks
	const settings = state.settings

	storeSettings(settings)
	storeBookmarks(bookmarks)
})
