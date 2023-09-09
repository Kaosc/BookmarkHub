export const cleanURL = (url: string): string | null => {
	let domain = null

	// Get the domain
	if (url?.startsWith("https://") || url?.startsWith("http://")) {
		try {
			domain = new URL(url).hostname
		} catch (e) {
			console.error("Cannot convert invalid URL", e)
			return null
		}
	}

	// Clean path
	if (domain?.includes("/")) {
		domain = domain.split("/")[0]
	}

	return domain
}
