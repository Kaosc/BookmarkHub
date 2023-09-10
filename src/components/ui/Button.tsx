import React from "react"

export default function Button({
	props,
	onClick,
	className,
	children,
}: {
	props?: React.ButtonHTMLAttributes<HTMLButtonElement>
	onClick?: React.DOMAttributes<HTMLButtonElement>["onClick"] | undefined
	className?: React.HTMLAttributes<HTMLButtonElement>["className"]
	children?: React.ReactNode
}) {
	return (
		<button
			className={`button ${className}`}
			onClick={onClick}
			{...props}
		>
			{children}
		</button>
	)
}
