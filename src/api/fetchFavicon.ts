import axios from "axios"

import { DUCK_FAVICON_API, ICON_HORSE_API, faviconPlaceHolder } from "../utils/constants"
import { cleanURL } from "../utils/cleanURL"

export const fetchFavicon = async (url: string): Promise<string> => {
	let favicon = faviconPlaceHolder
	let domain = cleanURL(url)
	// const sz = 128

	if (domain.endsWith("google.com")) return ICON_HORSE_API + domain

	await axios
		.get(domain, { baseURL: "https://favicongrabber.com/api/grab/" })
		.then((res) => {
			if (res.data.icons.length > 0) favicon = res.data.icons[0]?.src
			else favicon = DUCK_FAVICON_API + domain + ".ico"
		})
		.catch((_) => {
			favicon = DUCK_FAVICON_API + domain + ".ico"
		})

	return favicon
}
