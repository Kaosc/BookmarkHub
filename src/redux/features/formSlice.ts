import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	visible: false,
	groupId: "",
	prevBookmark: null,
}

export const formSlice = createSlice({
	name: "bookmarks",
	initialState: initialState,
	reducers: {
		toggleForm: (state, action) => {
			return {
				...state,
				visible: !state.visible,
				groupId: action.payload.groupId,
			}
		},
		setGroupId: (state, action) => {
			state.groupId = action.payload
		},
		setPrevBookmark: (state, action) => {
			state.prevBookmark = action.payload
		},
	},
})

export const { toggleForm, setGroupId, setPrevBookmark } = formSlice.actions
