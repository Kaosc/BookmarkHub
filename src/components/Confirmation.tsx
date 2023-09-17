import React from "react"
import Dialog from "./Dialog"
import Button from "./ui/Button"
import Text from "./ui/Text"

export default function Confirmation({
	title,
	onConfirm,
	onConfirmText,
	onDecline,
}: {
	title: string
	onConfirm: React.DOMAttributes<HTMLButtonElement>["onClick"]
	onConfirmText: string
	onDecline: React.DOMAttributes<HTMLButtonElement>["onClick"]
}) {
	return (
		<Dialog
			title={`Confirm ${title}`}
			onClose={onDecline}
			className="z-50"
		>
			<Text>Are you sure you want to do this?</Text>
			<div className="flex justify-end gap-2 mt-5">
				<Button onClick={onDecline}>Cancel</Button>
				<Button
					onClick={onConfirm}
					className="dangerButton"
				>
					{onConfirmText}
				</Button>
			</div>
		</Dialog>
	)
}
