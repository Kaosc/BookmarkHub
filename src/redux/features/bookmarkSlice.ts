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
				payload: {
					bookmark: Bookmark
					groupId: string
				}
			},
		) => {
			const { bookmark, groupId } = action.payload

			return state.map((group: BookmarkData) => {
				if (group.id === groupId) {
					return {
						...group,
						bookmarks: [...group.bookmarks, bookmark],
					}
				}
				return group
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
			},
		) => {
			const { bookmark, groupId } = action.payload

			return state.map((group: BookmarkData) => {
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
		moveBookmark: (
			state,
			action: {
				payload: {
					bookmarkId: string
					groupId: string
					toGroupId: string
				}
			},
		) => {
			const { bookmarkId, groupId, toGroupId } = action.payload

			const bookmarkToMove = state
				.find((group: BookmarkData) => group.id === groupId)
				?.bookmarks.find((bookmark: Bookmark) => bookmark.id === bookmarkId)

			if (bookmarkToMove) {
				return state.map((group: BookmarkData) => {
					if (group.id === groupId) {
						return {
							...group,
							bookmarks: group.bookmarks.filter((bookmark: Bookmark) => bookmark.id !== bookmarkId),
						}
					}
					if (group.id === toGroupId) {
						return {
							...group,
							bookmarks: [...group.bookmarks, bookmarkToMove],
						}
					}
					return group
				})
			}
			return state
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
	moveBookmark,
	editGroup,
	editGroupTitle,
	setBookmarkGroups,
} = bookmarksSlice.actions
