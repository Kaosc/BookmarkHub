import React from "react"

export default function Button({
	onClick,
	style,
	children,
	props,
}: {
	onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
	style?: string
	text?: string
	children?: React.ReactNode
	props?: React.ButtonHTMLAttributes<HTMLButtonElement>
}) {
	return (
		<button
			className={`px-4 py-1 ring-1 ring-[#a5a5a5] rounded-md text-[#a5a5a5] 
							hover:bg-[#f1f1f1ef] hover:text-black 
							transition-all duration-100 ease-in-out ${style}`}
			type="reset"
			onClick={onClick}
			{...props}
		>
			{children}
		</button>
	)
}
