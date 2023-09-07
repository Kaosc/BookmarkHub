import { configureStore } from "@reduxjs/toolkit"
import { bookmarksSlice } from "./features/bookmarkSlice"
import { formSlice } from "./features/formSlice"
// import { SettingsSlice } from "./features/SettingsSlice"

export const store = configureStore({
	reducer: {
		bookmarks: bookmarksSlice.reducer,
		form: formSlice.reducer,
		// Settings: SettingsSlice.reducer,
	},
})
