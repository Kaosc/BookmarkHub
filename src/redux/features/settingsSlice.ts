import { createSlice } from "@reduxjs/toolkit"
import { getSettings } from "../../utils/localStorage"
import { setDefaultTheme, setTheme } from "../../utils/setTheme"

const initialState: Settings = {
	visible: false,
	theme: "system",
	showBookmarksTitle: true,
	allowTwoLineTitle: false,
}

const setInitialState = (): Settings => {
	const localSettings = getSettings()

	if (localSettings) {
		setTheme(localSettings.theme)

		return {
			...localSettings,
			visible: false,
		}
	} else {
		setDefaultTheme()

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
