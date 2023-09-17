import { toast } from "react-toastify"

export const notify = (message: string, theme: AppTheme, error?: boolean, timeout?: number) => {
	toast[error ? "error" : "success"](message, {
		position: "bottom-center",
		autoClose: timeout || 2500,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: false,
		draggable: false,
		progress: undefined,
		theme:
			theme === "system"
				? window.matchMedia("(prefers-color-scheme: dark)").matches
					? "dark"
					: "light"
				: theme,
		className: "w-[60%] text-sm",
		role: "alert",
	})
}
