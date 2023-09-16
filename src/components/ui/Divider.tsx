import React from "react"

export default function Divider({
	className = "",
}: {
	className?: React.HTMLAttributes<HTMLDivElement>["className"]
}) {
	return <div className={`my-[5px] h-[1px] bg-[#a3a3a3] dark:bg-#3a3a3a ${className}`}></div>
}
