import { createSlice } from "@reduxjs/toolkit"

const defaultFormState: Form = {
	visible: false,
	mode: "addBookmark",
	initGroup: {
		id: "default",
		title: "Bookmark Hub",
	},
	prevBookmark: undefined,
}

export const formSlice = createSlice({
	name: "bookmarks",
	initialState: defaultFormState,
	reducers: {
		toggleForm: (
			state,
			action: {
				payload: {
					mode: FormMode
					initGroup?: GroupInfo
				}
			},
		) => {
			return {
				...state,
				visible: !state.visible,
				mode: action.payload.mode,
				initGroup: {
					id: action.payload.initGroup?.id || "default",
					title: action.payload.initGroup?.title || "Default",
				},
			}
		},
		setFormGroup: (state, action) => {
			return {
				...state,
				initGroup: {
					id: action.payload.id,
					title: action.payload.title,
				},
			}
		},
		setFormBookmark: (state, action) => {
			return {
				...state,
				prevBookmark: action.payload,
			}
		},
		resetFrom: () => defaultFormState,
	},
})

export const { toggleForm, setFormGroup, setFormBookmark, resetFrom } = formSlice.actions
