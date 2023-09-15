import React from "react"
import { MdDeleteForever } from "react-icons/md"

import Button from "./../ui/Button"
import Text from './../ui/Text';

export default function FormButtons({
	value,
	prevValue,
	handleSubmit,
	handleDelete,
	handleCancel,
}: {
	value: string
	prevValue: string | undefined
	handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void
	handleDelete: React.DOMAttributes<HTMLButtonElement>["onClick"]
	handleCancel: React.DOMAttributes<HTMLButtonElement>["onClick"]
}) {
	return (
		<div className="flex justify-between w-full mt-2">
			{/* DELETE */}
			{prevValue && (
				<Button
					className={`px-[10px] text-red-600 rin-1 ring-red-600 rounded-md hover:bg-red-600 hover:text-white`}
					onClick={handleDelete}
					props={{ title: "Delete Bookmark" }}
				>
					<MdDeleteForever size={20} />
				</Button>
			)}

			<div className="flex w-full items-center justify-end">
				{/* CANCEL */}
				<Button
					className={`mr-3`}
					onClick={handleCancel}
					props={{ type: "reset" }}
				>
					<Text>Cancel</Text>
				</Button>

				{/* EDIT & ADD */}
				<Button
					onClick={(e: React.MouseEvent<HTMLButtonElement>) => value && handleSubmit(e)}
					props={{ type: "submit" }}
				>
					<Text>{prevValue ? "Save" : "Add"}</Text>
				</Button>
			</div>
		</div>
	)
}
