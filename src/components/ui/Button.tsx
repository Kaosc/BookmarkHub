import React from "react"

export default function Button({
	onClick,
	className,
	children,
	props,
}: {
	onClick?: React.DOMAttributes<HTMLButtonElement>["onClick"] | undefined
	className?: React.HTMLAttributes<HTMLButtonElement>["className"]
	text?: string
	children?: React.ReactNode
	props?: React.ButtonHTMLAttributes<HTMLButtonElement>
}) {
	return (
		<button
			className={`items-center justify-center px-2 py-1 ring-1 ring-[#a5a5a5] rounded-md text-[#a5a5a5] 
							hover:bg-[#f1f1f1ef] hover:text-black 
							transition-all duration-100 ease-in-out ${className}`}
			onClick={onClick}
			{...props}
		>
			{children}
		</button>
	)
}
