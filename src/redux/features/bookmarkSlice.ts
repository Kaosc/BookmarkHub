import { createSlice } from "@reduxjs/toolkit"
import { getBookmarks } from "../../utils/localStorage"

const setInitialState = () => {
	const initialState: BookmarkGroups = [
		{
			id: "pinned-group",
			title: "Pinned",
			bookmarks: [
				{
					id: "pinned-1",
					title: "Google",
					url: "https://google.com",
					favicon: "https://www.google.com/favicon.ico",
				},
				{
					id: "pinned-2",
					title: "Google Translate",
					url: "https://translate.google.com",
					favicon: "https://translate.google.com/favicon.ico",
				},
				{
					id: "pinned-3",
					title: "Kaosc",
					url: "https://kaosc.vercel.app",
					favicon: "https://kaosc.vercel.app/favicon.ico",
				},
			],
		},
		{
			id: "default-group",
			title: "Default",
			bookmarks: [
				{
					id: "default-1",
					title: "Material UI",
					url: "https://material-ui.com",
					favicon: "https://material-ui.com/static/favicon.ico",
				},
				{
					id: "default-2",
					title: "React",
					url: "https://reactjs.org",
					favicon: "https://reactjs.org/favicon.ico",
				},
				{
					id: "default-3",
					title: "Kavaklakerda",
					url: "https://kavaklakerda.vercel.app",
					favicon: "https://kavaklakerda.vercel.app/favicon.ico",
				},
			],
		},
	]

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
		removeBookmark: (
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
	},
})

export const { addBookmark, removeBookmark, editBookmark, addGroup, deleteGroup, editGroup } =
	bookmarksSlice.actions
