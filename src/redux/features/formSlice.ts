import { createSlice } from "@reduxjs/toolkit"

const defaultFormState: Form = {
	visible: false,
	mode: "addBookmark",
	prevBookmark: undefined,
	prevGroup: {
		id: "default",
		title: "Default",
	},
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
					prevBookmark?: Bookmark
					prevGroup?: {
						id: string
						title: string
					}
				}
			},
		) => {
			return {
				...state,
				visible: !state.visible,
				mode: action.payload.mode,
				prevBookmark: action.payload.prevBookmark,
				prevGroup: action.payload.prevGroup,
			}
		},
		resetFrom: () => defaultFormState,
	},
})

export const { toggleForm, resetFrom } = formSlice.actions
