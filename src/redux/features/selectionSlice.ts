import { createSlice } from "@reduxjs/toolkit"

const initialState: SelectionState = {
	selectionMode: false,
	selectedGroup: null,
	selectedBookmarks: [],
}

export const selectionSlice = createSlice({
	name: "bookmarks",
	initialState: initialState,
	reducers: {
		toggleSelectionMode: (state) => {
			return {
				selectionMode: !state.selectionMode,
				selectedGroup: null,
				selectedBookmarks: [],
			}
		},
		setSelectedBookmarks: (
			state,
			action: {
				payload: Bookmark[]
			}
		) => {
			return {
				...state,
				selectedBookmarks: [...state.selectedBookmarks, ...action.payload],
			}
		},
		removeSelectedBookmark: (state, action) => {
			return {
				...state,
				selectedBookmarks: state.selectedBookmarks.filter((b) => b.id !== action.payload),
			}
		},
		clearAllSelections: (state) => {
			return {
				...state,
				selectedGroup: null,
				selectedBookmarks: [],
			}
		},
	},
})

export const { toggleSelectionMode, setSelectedBookmarks, removeSelectedBookmark, clearAllSelections } =
	selectionSlice.actions
