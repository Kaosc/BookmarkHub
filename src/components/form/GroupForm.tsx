import React, { useState } from "react"
import { nanoid } from "nanoid"

import { useDispatch } from "react-redux"
import { addGroup, deleteGroup, editGroupTitle } from "../../redux/features/bookmarkSlice"

import Dialog from "../Dialog"
import FormButtons from "./FormButtons"

export default function GroupForm({
	prevGroup,
	handleFormVisible,
}: {
	prevGroup?: { id: string; title: string }
	handleFormVisible: Function
}) {
	const dispatch = useDispatch()

	const [group, setGroup] = useState(prevGroup || { id: "default", title: "" })

	const quitFrom = (e: React.MouseEvent<HTMLButtonElement>) => {
		handleFormVisible()
		e.preventDefault()
	}

	const handleGroupTitleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setGroup({
			...group,
			title: e.target.value,
		})
	}

	const handleGroupEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		dispatch(editGroupTitle({ id: group.id, title: group.title }))
		quitFrom(e)
	}

	const handleGroupAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		dispatch(addGroup({ id: nanoid(), title: group.title, bookmarks: [] }))
		quitFrom(e)
	}

	const handleGroupDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		dispatch(deleteGroup(group.id))
		quitFrom(e)
	}

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()

		if (prevGroup) {
			handleGroupEdit(e)
		} else {
			handleGroupAdd(e)
		}
	}

	return (
		<Dialog
			onClose={quitFrom}
			title={prevGroup ? "Edit Group" : "Add Group"}
		>
			<input
				value={group.title}
				required
				className="input"
				type="text"
				placeholder={"Group Title"}
				onChange={handleGroupTitleEdit}
			/>
			<FormButtons
				value={group.title}
				prevValue={prevGroup?.title}
				handleSubmit={handleSubmit}
				handleDelete={handleGroupDelete}
				handleCancel={quitFrom}
			/>
		</Dialog>
	)
}
