import { toast } from "react-toastify"

export const notify = (message: string, error?: boolean) => {
	// check is there dark class in body
	const theme = document.body.classList.contains("dark") ? "dark" : "light"

	toast[error ? "error" : "success"](message, {
		position: "bottom-center",
		autoClose: 2000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: false,
		draggable: false,
		progress: undefined,
		theme: theme,
		className: "w-[60%] text-sm",
		role: "alert",
	})
}
