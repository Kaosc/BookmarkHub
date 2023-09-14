import { toast } from "react-toastify"

export const notify = (message: string, error?: boolean) => {
	toast[error ? "error" : "success"](message, {
		position: "bottom-center",
		autoClose: 2000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: false,
		draggable: false,
		progress: undefined,
		theme: "dark",
		className: "w-[60%] text-sm",
		role: "alert",
	})
}
