import { configureStore } from "@reduxjs/toolkit"
import { bookmarksSlice } from "./features/bookmarkSlice"
// import { SettingsSlice } from "./features/SettingsSlice"

export const store = configureStore({
	reducer: {
		bookmarks: bookmarksSlice.reducer,
		// Settings: SettingsSlice.reducer,
	},
})
