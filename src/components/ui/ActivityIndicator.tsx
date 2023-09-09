export default function ActivityIndicator({ size, color }: { size?: string, color?: string }) {
	const sizeStyle = size ? size : "h-14 w-14"
	const colorStyle = color ? `border-[${color}]` : "border-gray"
	
	return (
		<div className="flex flex-col items-center justify-center my-7">
			<div className={`animate-spin rounded-full border-b-4 ${colorStyle} ${sizeStyle}`}></div>
		</div>
	)
}
