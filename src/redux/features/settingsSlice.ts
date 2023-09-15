import { createSlice } from "@reduxjs/toolkit"

/* 
	dark mode  (dark/light)	
	import/export bookmarks as json
	show/hide bookmark titles
	allow/dissallow two line titles
	add https:// to url or not

	- version
	- dev website
	- github
	- report bug / contact
	- other apps
*/

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
