import { useEffect } from "react"

import { IoMdClose } from "react-icons/io"

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
					className={`relative flex-col w-4/5 bg-gradient-to-r from-[#0e0e0e] to-zinc-950 p-5 rounded-lg animate-in fade-in-0 slide-in-from-top-20 duration-300`}
				>
					<button
						className="absolute top-3 right-3 text-white hover:opacity-50 hover:animate-pulse cursor-pointer"
						onClick={onClose}
						title="Close Dialog"
					>
						<IoMdClose size={30} />
					</button>

					<h1 className="text-2xl text-white font-bold mb-4">{title}</h1>
					{children}
				</div>
			</div>
		</div>
	)
}
