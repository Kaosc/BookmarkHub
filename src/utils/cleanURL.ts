export const cleanURL = (url: string): string => {
	let domain = url

	// Get the domain
	if (url?.startsWith("https://") || url?.startsWith("http://")) {
		try {
			domain = new URL(url).hostname
		} catch (e) {
			console.error("Cannot convert invalid URL", e)
		}
	}

	// Clean path
	if (domain?.includes("/")) {
		domain = domain.split("/")[0]
	}

	return domain
}
