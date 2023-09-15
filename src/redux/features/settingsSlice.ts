import { createSlice } from "@reduxjs/toolkit"

export const settingsSlice = createSlice({
	name: "settings",
	initialState: "",
	reducers: {
		setSettings: (_, action) => {
			return action.payload
		},
	},
})

export const { setSettings } = settingsSlice.actions
