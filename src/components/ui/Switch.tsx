import React from "react"

export default function Switch({
	checked,
	onChange,
}: {
	checked: boolean
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
	return (
		<label className="relative inline-flex items-center justify-center mb-5 cursor-pointer">
			<input
				type="checkbox"
				checked={checked}
				className="sr-only peer"
				onChange={onChange}
			/>
			<div className="w-10 h-5 bg-[#2b2b2b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border after:rounded-full after:h-[16px] after:w-[16px] after:transition-all peer-checked:bg-[#575757]"></div>
		</label>
	)
}
