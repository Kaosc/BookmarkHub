export default function Text({
	children,
	className,
}: {
	children: React.ReactNode
	className?: React.HTMLAttributes<HTMLParagraphElement>["className"]
}) {
	return <p className={`text-black dark:text-white ${className}`}>{children}</p>
}
