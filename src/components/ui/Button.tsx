import React from "react"

export default function Button({
	props,
	onClick,
	className,
	children,
	type,
}: {
	props?: React.ButtonHTMLAttributes<HTMLButtonElement>
	onClick?: React.DOMAttributes<HTMLButtonElement>["onClick"] | undefined
	className?: React.HTMLAttributes<HTMLButtonElement>["className"]
	children?: React.ReactNode
	type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"]
}) {
	return (
		<button
			className={`button ${className}`}
			onClick={onClick}
			type={type}
			{...props}
		>
			{children}
		</button>
	)
}
