import axios from "axios"

import { DUCK_FAVICON_API, faviconPlaceHolder } from "../utils/constants"
import { cleanURL } from "../utils/cleanURL"

export const fetchFavicon = async (url: string): Promise<string> => {
	let favicon = faviconPlaceHolder
	let domain = cleanURL(url)
	// const sz = 128

	if (!domain) return favicon

	await axios
		.get(domain, { baseURL: "https://favicongrabber.com/api/grab/" })
		.then((res) => {
			if (res) {
				favicon = res.data.icons[0]?.src
			}
		})
		.catch((e) => {
			console.error("Cannot fetch favicon", e)
			// favicon = GOOGLE_FAVICON_API + domain + "&sz=" + sz
			favicon = DUCK_FAVICON_API + domain + ".ico"
		})

	return favicon
}
