import { createSlice } from "@reduxjs/toolkit"
import { getBookmarks } from "../../utils/localStorage"

const setInitialState = () => {
	const initialState: Bookmarks = [
		{
			id: "pinned",
			title: "Pinned",
			bookmarks: [],
		},
		{
			id: "default",
			title: "Default",
			bookmarks: [],
		},
	]

	if (getBookmarks()) {
		return getBookmarks()
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
				payload: {
					bookmark: Bookmark
					groupId: string
				}
			}
		) => {
			const { bookmark, groupId } = action.payload

			return state.map((group: BookmarkGroup) => {
				if (group.id === groupId) {
					return {
						...group,
						bookmarks: [...group.bookmarks, bookmark],
					}
				}
				return group
			})
		},
		removeBookmark: (
			state,
			action: {
				payload: {
					bookmarkId: string
					groupId: string
				}
			}
		) => {
			const { bookmarkId, groupId } = action.payload

			return state.map((group: BookmarkGroup) => {
				if (group.id === groupId) {
					return {
						...group,
						bookmarks: group.bookmarks.filter((bookmark: Bookmark) => bookmark.id !== bookmarkId),
					}
				}
				return group
			})
		},
		editBookmark: (
			state,
			action: {
				payload: {
					bookmark: Bookmark
					groupId: string
				}
			}
		) => {
			const { bookmark, groupId } = action.payload

			return state.map((group: BookmarkGroup) => {
				if (group.id === groupId) {
					return {
						...group,
						bookmarks: group.bookmarks.map((bookmarkItem: Bookmark) => {
							if (bookmarkItem.id === bookmark.id) {
								return bookmark
							}
							return bookmarkItem
						}),
					}
				}
				return group
			})
		},
		addGroup: (state, action: { payload: BookmarkGroup }) => {
			const { payload } = action

			return [...state, payload]
		},
		deleteGroup: (state, action: { payload: string }) => {
			const { payload } = action

			return state.filter((group: BookmarkGroup) => group.id !== payload)
		},
		editGroup: (state, action: { payload: BookmarkGroup }) => {
			const { payload } = action

			return state.map((group: BookmarkGroup) => {
				if (group.id === payload.id) {
					return payload
				}
				return group
			})
		},
	},
})

export const { addBookmark } = bookmarksSlice.actions
