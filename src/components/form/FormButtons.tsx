import React from "react"
import { MdDeleteForever } from "react-icons/md"

import Button from "./../ui/Button"

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
					type="button"
				>
					<MdDeleteForever size={20} />
				</Button>
			)}

			<div className="flex w-full items-center justify-end">
				{/* CANCEL */}
				<Button
					className={`mr-3`}
					onClick={handleCancel}
					type="button"
				>
					<p>Cancel</p>
				</Button>

				{/* EDIT & ADD */}
				<Button
					onClick={(e: React.MouseEvent<HTMLButtonElement>) => value && handleSubmit(e)}
					type="submit"
				>
					<p>{prevValue ? "Save" : "Add"}</p>
				</Button>
			</div>
		</div>
	)
}
