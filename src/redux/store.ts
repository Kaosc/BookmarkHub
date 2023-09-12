import { configureStore } from "@reduxjs/toolkit"
import { bookmarksSlice } from "./features/bookmarkSlice"
import { searchSlice } from "./features/searchSlice"
import { settingsSlice } from "./features/settingsSlice"

export const store = configureStore({
	reducer: {
		bookmarks: bookmarksSlice.reducer,
		search: searchSlice.reducer,
		Settings: settingsSlice.reducer,
	},
})
