export const setTheme = (theme: AppTheme) => {
	if (theme === "dark") {
		document.documentElement.classList.add("dark")
	} else if (theme === "light") {
		document.documentElement.classList.remove("dark")
	} else {
		// system
		if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			document.documentElement.classList.add("dark")
		} else {
			document.documentElement.classList.remove("dark")
		}
	}
}

export const setDefaultTheme = () => { // set system theme as default
	if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
		document.documentElement.classList.add("dark")
	} else {
		document.documentElement.classList.remove("dark")
	}
}
