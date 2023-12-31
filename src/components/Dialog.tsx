import { useEffect } from "react"

import { IoMdClose } from "react-icons/io"

import Text from "./ui/Text"

export default function Dialog({
	title,
	onClose,
	children,
	className,
	dialogClassName,
}: {
	title: string
	onClose: React.DOMAttributes<HTMLButtonElement>["onClick"]
	children: React.ReactNode
	className?: React.HTMLAttributes<HTMLDivElement>["className"]
	dialogClassName?: React.HTMLAttributes<HTMLDivElement>["className"]
}) {
	useEffect(() => {
		const handleKeydown = (e: KeyboardEvent) => e.key === "Enter" && e.preventDefault()
		window.addEventListener("keydown", handleKeydown)
		return () => window.removeEventListener("keydown", handleKeydown)
	}, [])

	return (
		<div
			className={`absolute top-0 left-0 flex-col w-[450px] h-[565px] bg-[#000000af] transition-all ease-in-out ${className}`}
		>
			<div className={`flex w-full h-full items-center justify-center transition-all ease-in-out`}>
				<div
					className={`relative flex-col w-[80%] bg-gradient-to-r from-zinc-200 to-zinc-50 dark:from-[#0e0e0e]
					dark:to-zinc-950 p-5 rounded-lg animate-in fade-in-0 slide-in-from-top-20 duration-300 ${dialogClassName}`}
				>
					<button
						className="absolute top-3 right-3 text-white hover:opacity-50 hover:animate-pulse cursor-pointer"
						onClick={onClose}
						title="Close Dialog"
					>
						<IoMdClose
							size={30}
							className="themed"
						/>
					</button>

					<Text className="text-[22px] font-bold mb-4">{title}</Text>
					{children}
				</div>
			</div>
		</div>
	)
}
