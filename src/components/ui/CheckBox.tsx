import React, { memo } from "react"

function CheckBox({
	onChange,
	checked = false,
	className,
}: {
	onChange: React.ChangeEventHandler<HTMLInputElement>
	checked?: boolean
	className?: string
}) {
	return (
		<input
			className={`checkBox ${className}`}
			type="checkbox"
			value=""
			checked={checked}
			id="checkboxDefault"
			onChange={onChange}
		/>
	)
}

export default memo(CheckBox, (prevProps, nextProps) => {
	return prevProps.onChange === nextProps.onChange
})
