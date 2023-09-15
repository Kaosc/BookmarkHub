import { useCallback, useState } from "react"
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"

import { IoIosAdd } from "react-icons/io"
import { AiFillEdit } from "react-icons/ai"
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai"

import Bookmark from "./sortable/Bookmark"
import BookmarkForm from "./form/BookmarkForm"
import GroupForm from "./form/GroupForm"
import { nanoid } from "nanoid"
import { useDispatch, useSelector } from "react-redux"
import { setBookmarkGroups } from "../redux/features/bookmarkSlice"

export default function GroupContainer({ bookmarkData }: { bookmarkData: BookmarkData }) {
	const bookmarkGroups = useSelector((state: RootState) => state.bookmarks)
	const dispatch = useDispatch()

	const isGroupDefault = bookmarkData.id === "default"

	const [bookmarkFormVisible, setBookmarkFormVisible] = useState(false)
	const [groupFormVisible, setGroupFormVisible] = useState(false)

	const { setNodeRef } = useDroppable({ id: bookmarkData.id })

	const handleBookmarkFormVisible = () => setBookmarkFormVisible((prev) => !prev)
	const handleGroupFormVisible = () => setGroupFormVisible((prev) => !prev)

	const GroupHeader = useCallback(() => {
		const moveGroupTo = (to: string) => {
			const toIndex = to === "up" ? -1 : 1
			const groupIndex = bookmarkGroups.findIndex((group) => group.id === bookmarkData.id)

			const newBookmarkGroups = arrayMove(bookmarkGroups, groupIndex, groupIndex + toIndex)

			dispatch(setBookmarkGroups(newBookmarkGroups))
		}

		const buttonStyle = "flex items-center justify-center hover:opacity-50 hover:animate-pulse"

		return (
			<div
				className={`
			flex items-center justify-between mx-2 px-2 py-[2px] my-2
			rounded-full bg-[#1B1B1C]
			transition-all ease-in-out shadow-lg shadow-[rgba(0, 0, 0, 0.603)]
			${bookmarkData?.id === "default" && bookmarkData?.bookmarks?.length > 0 ? "invisible" : "visible"}
			${bookmarkData?.id === "default" ? "opacity-0" : ""}
			${bookmarkData?.id === "default" && bookmarkData?.bookmarks?.length > 0 ? "hidden" : "block"}
		`}
			>
				{/* TITLE */}
				<h1 className="pl-2 text-[13.5px] font-semibold text-center text-zinc-200 truncate max-w-xs">
					{bookmarkData?.title === "default" ? "Bookmark Hub" : bookmarkData?.title}
				</h1>

				{/* BUTTONS */}
				<div className="flex items-center justify-between">
					{/* MOVE UP & DOWN BUTTONS */}
					{bookmarkGroups.findIndex((group) => group.id === bookmarkData.id) !== 1 && (
						<button
							className={buttonStyle}
							onClick={() => moveGroupTo("up")}
							title="Move Group Up"
						>
							<AiOutlineArrowUp
								size={17}
								className="text-white"
							/>
						</button>
					)}
					{bookmarkGroups.findIndex((group) => group.id === bookmarkData.id) !==
						bookmarkGroups.length - 1 && (
						<button
							className={buttonStyle}
							onClick={() => moveGroupTo("down")}
							title="Move Group Down"
						>
							<AiOutlineArrowDown
								size={17}
								className="text-white mr-[2px]"
							/>
						</button>
					)}

					{/* EDIT GROUP BUTTON */}
					{!isGroupDefault && (
						<button
							className={buttonStyle}
							onClick={handleGroupFormVisible}
							title="Edit Group"
						>
							<AiFillEdit
								size={17}
								className="text-white mr-[1px]"
							/>
						</button>
					)}

					{/* ADD BOOKMARK BUTTON */}
					<button
						className={buttonStyle}
						onClick={handleBookmarkFormVisible}
						title="Add Bookmark to this Group"
					>
						<IoIosAdd
							size={26}
							className="text-white"
						/>
					</button>
				</div>
			</div>
		)
	}, [
		bookmarkData?.id,
		bookmarkData?.title,
		bookmarkData?.bookmarks?.length,
		isGroupDefault,
		bookmarkGroups,
		dispatch,
	])

	return (
		<>
			{bookmarkFormVisible && (
				<BookmarkForm
					initGroupToAdd={{
						id: bookmarkData.id,
						title: bookmarkData.title,
					}}
					handleFormVisible={handleBookmarkFormVisible}
				/>
			)}
			{groupFormVisible && (
				<GroupForm
					prevGroup={{ id: bookmarkData.id, title: bookmarkData.title }}
					handleFormVisible={handleGroupFormVisible}
				/>
			)}
			<SortableContext
				id={bookmarkData?.id}
				items={bookmarkData?.bookmarks || []}
				strategy={rectSortingStrategy}
			>
				{/* GROUP HEADER */}
				<div
					key={bookmarkData?.id || ""}
					ref={setNodeRef}
					className="flex flex-col w-full transition-all ease-in-out"
				>
					<GroupHeader />

					{/* BOOKMARK LISTS */}
					<div className="grid grid-cols-6 px-1">
						{bookmarkData?.bookmarks?.map((bookmark) => (
							<Bookmark
								key={bookmark?.id || nanoid()}
								bookmark={bookmark}
							/>
						))}
					</div>
				</div>
			</SortableContext>
		</>
	)
}
