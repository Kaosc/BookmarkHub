import React from "react"
import BookmarkForm from "../components/BookmarkForm"
import { useState } from "react"
import { IoIosAdd } from "react-icons/io"

export default function BookmarkGroup({
	children,
	initGroupId,
	title,
}: {
	children: React.ReactNode
	initGroupId: string
	title: string
}) {
	const [formVisible, setFormVisible] = useState(false)

	const formVisibleHandler = () => {
		setFormVisible((prev) => !prev)
	}

	return (
		<>
			{formVisible && (
				<BookmarkForm
					handleAddButtonClick={formVisibleHandler}
					initGroupId={initGroupId}
				/>
			)}
			<section className="flex flex-col items-center justify-center w-full">
				<div className="flex w-full items-center justify-between px-2 bg-gradient-to-r from-zinc-800 to-zinc-700">
					<h1 className="py-2 text-base font-bold text-center text-white">{title}</h1>
					<button
						className="flex items-center justify-center hover:opacity-50 hover:animate-pulse"
						onClick={() => formVisibleHandler()}>
						<IoIosAdd size={30} className="text-white" />
					</button>
				</div>
				<div className="flex w-full flex-wrap justify-start p-3">{children}</div>
			</section>
		</>
	)
}
