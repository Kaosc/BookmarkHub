import React, { useState } from "react"
import { nanoid } from "nanoid"
import { useDispatch, useSelector } from "react-redux"
// import Dialog from "./Dialog"

export default function GroupForm() {
	const dispatch = useDispatch()
	const bookmarkGroups = useSelector((state: RootState) => state.bookmarks)

	// FORM STATES
	const [bookmarkDataGroup, setBookmarkDataGroup] = useState({ id: "", title: "" })

	const quitFrom = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
	}

	////////////////////////// GROUP SUBMIT //////////////////////////

	const handleGroupTitleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		// dispatch(editGroupTitle({ id: bookmarkDataGroup.id || "default", title: bookmarkDataGroup.title }))
		quitFrom(e)
	}

	const handleGroupSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		// dispatch(addGroup({ id: nanoid(), title: bookmarkDataGroup.title, bookmarks: [] }))
		quitFrom(e)
	}

	const handleGroupDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		// dispatch(deleteGroup(bookmarkDataGroup.id))
		quitFrom(e)
	}

	////////////////////////// COMPONENTS //////////////////////////

	return (
		<form className="flex flex-col items-center">
			<input
				value={bookmarkDataGroup.title}
				className="input"
				type="text"
				placeholder={"Group Title"}
				// onChange={handleGroupTitleEdit}
			/>
		</form>
	)
}
