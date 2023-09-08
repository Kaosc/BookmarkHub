import { faviconPlaceHolder } from "../utils/constants"
import axios from "axios"

export const fetchFaviconGrabber = async (url: string): Promise<string> => {
	let favicon = faviconPlaceHolder

	const domain = new URL(url).hostname

	try {
		const {
			data: { icons },
		} = await axios.get(domain, {
			baseURL: "https://favicongrabber.com/api/grab/",
		})
		if (icons[0]?.src) {
			favicon = icons[0].src
		} else {
			console.warn(`No favicon found for ${url}`)
		}
	} catch (error) {
		console.error(error)
	}

	return favicon
}
