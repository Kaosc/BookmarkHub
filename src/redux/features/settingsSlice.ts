import { createSlice } from "@reduxjs/toolkit"
import { getSettings } from "../../utils/localStorage"

const initialState: Settings = {
	visible: false,
	theme: "system",
	showBookmarksTitle: true,
	allowTwoLineTitle: false,
}

const setInitialState = (): Settings => {
	const localSettings = getSettings()

	if (localSettings) {
		// Set Theme
		if (localSettings.theme === "dark") {
			document.documentElement.classList.add("dark")
		} else if (localSettings.theme === "light") {
			document.documentElement.classList.remove("dark")
		} else {
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark")
			} else {
				document.documentElement.classList.remove("dark")
			}
		}
		return {
			...localSettings,
			visible: false,
		}
	} else {
		if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			document.documentElement.classList.add("dark")
		} else {
			document.documentElement.classList.remove("dark")
		}

		return initialState
	}
}

export const settingsSlice = createSlice({
	name: "settings",
	initialState: setInitialState(),
	reducers: {
		setSettings: (state, action) => {
			return { ...state, ...action.payload }
		},
		toggleSettings: (state) => {
			return { ...state, visible: !state.visible }
		},
	},
})

export const { setSettings, toggleSettings } = settingsSlice.actions
