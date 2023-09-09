export default function ActivityIndicator({
	className,
}: {
	className?: React.HTMLAttributes<HTMLButtonElement>["className"]
}) {
	return (
		<div className="flex flex-col items-center justify-center">
			<div className={`animate-spin rounded-full border-b-4 h-14 w-14 border-gray ${className}`}></div>
		</div>
	)
}
