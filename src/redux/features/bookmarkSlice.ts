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
			}
		) => {
			const bookmark = action.payload

			return state.map((group: BookmarkData) => {
				if (group.id === bookmark.groupId) {
					return {
						...group,
						bookmarks: [bookmark, ...group.bookmarks],
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
			}
		) => {
			const { bookmarkId, groupId } = action.payload

			return state.map((group: BookmarkData) => {
				if (group.id === groupId) {
					return {
						...group,
						bookmarks: group.bookmarks.filter((b: Bookmark) => b.id !== bookmarkId),
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
					prevGroupId?: string
				}
			}
		) => {
			const { prevGroupId, bookmark } = action.payload

			if (prevGroupId) {
				return state.map((group: BookmarkData) => {
					if (group.id === bookmark.groupId) {
						return {
							...group,
							bookmarks: [...group.bookmarks, bookmark],
						}
					} else if (group.id === prevGroupId) {
						return {
							...group,
							bookmarks: group.bookmarks.filter((b: Bookmark) => b.id !== bookmark.id),
						}
					} else {
						return group
					}
				})
			} else {
				return state.map((group: BookmarkData) => {
					if (group.id === bookmark.groupId) {
						return {
							...group,
							bookmarks: group.bookmarks.map((b: Bookmark) => {
								if (b.id === bookmark.id) {
									return bookmark
								} else {
									return b
								}
							}),
						}
					} else {
						return group
					}
				})
			}
		},
		addGroup: (state, action: { payload: BookmarkData }) => {
			const { payload } = action
			return [state[0], payload, ...state.slice(1)]
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
		editGroupTitle: (state, action: { payload: GroupInfo }) => {
			const { id, title } = action.payload

			return state.map((group: BookmarkData) => {
				if (group.id === id) {
					return {
						...group,
						title: title,
					}
				} else {
					return group
				}
			})
		},
		setBookmarkGroups: (_, action: { payload: BookmarkGroups }) => {
			return action.payload
		},
		deleteSelectedBookmarks: (
			state,
			action: {
				payload: string[]
			}
		) => {
			const selectedBookmarkIds = action.payload

			return state.map((group: BookmarkData) => {
				return {
					...group,
					bookmarks: group.bookmarks.filter((b: Bookmark) => !selectedBookmarkIds.includes(b.id)),
				}
			})
		},
		moveSelectedBookmarks: (
			state,
			action: {
				payload: {
					selectedBookmarks: Bookmark[]
					toGroupId: string
				}
			}
		) => {
			const { selectedBookmarks, toGroupId } = action.payload
			const selectedBookmarkIds = selectedBookmarks.map((b) => b.id)

			let newState = state.map((group: BookmarkData) => {
				return {
					...group,
					bookmarks: group.bookmarks.filter((b: Bookmark) => !selectedBookmarkIds.includes(b.id)),
				}
			})

			return newState.map((group: BookmarkData) => {
				if (group.id === toGroupId) {
					return {
						...group,
						bookmarks: [...group.bookmarks, ...selectedBookmarks.map((b) => ({ ...b, groupId: toGroupId }))],
					}
				} else {
					return group
				}
			})
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
	deleteSelectedBookmarks,
	moveSelectedBookmarks,
} = bookmarksSlice.actions
