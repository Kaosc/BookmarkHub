import { createSlice } from "@reduxjs/toolkit"

import { getBookmarks } from "../../utils/localStorage"
import { InitialBookmarks } from "../../data/InitialBookmarks"

const setInitialState = () => {
	const initialState: BookmarkGroups = InitialBookmarks

	const localBookmarks = getBookmarks()

	if (localBookmarks) {
		return localBookmarks
	} else {
		return initialState
	}
}

export const bookmarksSlice = createSlice({
	name: "bookmarks",
	initialState: setInitialState(),
	reducers: {
		addBookmark: (
			state,
			action: {
				payload: Bookmark
			},
		) => {
			const bookmark = action.payload
			return state.map((group: BookmarkData) => {
				if (group.id === bookmark.group) {
					return {
						...group,
						bookmarks: [...group.bookmarks, bookmark],
					}
				} else {
					return group
				}
			})
		},
		deleteBookmark: (
			state,
			action: {
				payload: {
					bookmarkId: string
					groupId: string
				}
			},
		) => {
			const { bookmarkId, groupId } = action.payload

			return state.map((group: BookmarkData) => {
				if (group.id === groupId) {
					return {
						...group,
						bookmarks: group.bookmarks.filter((bookmark: Bookmark) => bookmark.id !== bookmarkId),
					}
				} else {
					return group
				}
			})
		},
		editBookmark: (
			state,
			action: {
				payload: {
					bookmark: Bookmark
					movedFromId?: string
				}
			},
		) => {
			const { movedFromId, bookmark } = action.payload

			return state.map((group: BookmarkData) => {
				if (group.id === movedFromId) {
					return {
						...group,
						bookmarks: group.bookmarks.filter((b: Bookmark) => b.id !== bookmark.id),
					}
				} else if (group.id === bookmark.group) {
					return {
						...group,
						bookmarks: [...group.bookmarks, bookmark],
					}
				} else {
					return group
				}
			})
		},
		addGroup: (state, action: { payload: BookmarkData }) => {
			const { payload } = action

			return [...state, payload]
		},
		deleteGroup: (state, action: { payload: string }) => {
			const { payload } = action

			return state.filter((group: BookmarkData) => group.id !== payload)
		},
		editGroup: (state, action: { payload: BookmarkData }) => {
			const { payload } = action

			return state.map((group: BookmarkData) => {
				if (group.id === payload.id) {
					return payload
				}
				return group
			})
		},
		editGroupTitle: (state, action: { payload: { id: string; title: string } }) => {
			const { payload } = action
			return state.map((group: BookmarkData) => {
				if (group.id === payload.id) {
					return {
						...group,
						title: payload.title,
					}
				}
				return group
			})
		},
		setBookmarkGroups: (_, action: { payload: BookmarkGroups }) => {
			return action.payload
		},
	},
})

export const {
	addBookmark,
	deleteBookmark,
	editBookmark,
	addGroup,
	deleteGroup,
	editGroup,
	editGroupTitle,
	setBookmarkGroups,
} = bookmarksSlice.actions
