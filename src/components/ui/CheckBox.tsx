import React, { memo } from "react"

function CheckBox({
	onChange,
	checked = false,
}: {
	onChange: React.ChangeEventHandler<HTMLInputElement>
	checked?: boolean
}) {
	return (
		<input
			className="checkBox"
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
