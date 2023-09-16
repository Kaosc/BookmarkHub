import { useEffect } from "react"

import { IoMdClose } from "react-icons/io"

import Text from "./ui/Text"

export default function Dialog({
	title,
	onClose,
	children,
}: {
	title: string
	onClose: React.DOMAttributes<HTMLButtonElement>["onClick"]
	children: React.ReactNode
}) {
	useEffect(() => {
		const handleKeydown = (e: KeyboardEvent) => e.key === "Enter" && e.preventDefault()
		window.addEventListener("keydown", handleKeydown)
		return () => window.removeEventListener("keydown", handleKeydown)
	}, [])

	return (
		<div
			className={`absolute top-0 left-0 items-center justify-center flex-col w-[430px] h-[550px] z-30 bg-[#000000af] transition-all ease-in-out`}
		>
			<div className={`flex w-full h-full items-center justify-center transition-all ease-in-out`}>
				<div
					className={`relative flex-col w-4/5 bg-gradient-to-r from-zinc-200 to-zinc-50 dark:from-[#0e0e0e] dark:to-zinc-950 p-5 rounded-lg animate-in fade-in-0 slide-in-from-top-20 duration-300`}
				>
					<button
						className="absolute top-3 right-3 text-white hover:opacity-50 hover:animate-pulse cursor-pointer"
						onClick={onClose}
						title="Close Dialog"
					>
						<IoMdClose size={30} className="text-black dark:text-white"/>
					</button>

					<Text className="text-2xl font-bold mb-4">{title}</Text>
					{children}
				</div>
			</div>
		</div>
	)
}
