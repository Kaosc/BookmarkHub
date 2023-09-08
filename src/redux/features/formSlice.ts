import { createSlice } from "@reduxjs/toolkit"

const defaultFormState: Form = {
	visible: false,
	mode: "addBookmark",
	group: {
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
					group?: GroupInfo
				}
			},
		) => {
			return {
				...state,
				visible: !state.visible,
				mode: action.payload.mode,
				group: {
					id: action.payload.group?.id || "default",
					title: action.payload.group?.title || "Default",
				},
			}
		},
		setFormGroup: (state, action) => {
			return {
				...state,
				group: {
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
