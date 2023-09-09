import { createSlice } from "@reduxjs/toolkit"

export const searchSlice = createSlice({
	name: "bookmarks",
	initialState: "",
	reducers: {
		setSearch: (_, action) => {
			return action.payload
		},
	},
})

export const { setSearch } = searchSlice.actions
