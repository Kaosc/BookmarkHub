import axios from "axios"

import {
	DUCK_FAVICON_API,
	ICON_HORSE_API,
	GOOGLE_FAVICON_API,
	faviconPlaceHolder,
	FAVICON_GRABBER_API,
} from "../utils/constants"
import { cleanURL } from "../utils/cleanURL"

export const fetchFavicon = async (url: string): Promise<string[]> => {
	const favicons = [faviconPlaceHolder]

	let domain = cleanURL(url)

	favicons.push(ICON_HORSE_API + domain)
	favicons.push(DUCK_FAVICON_API + domain + ".ico")
	favicons.push(GOOGLE_FAVICON_API + domain + "&sz=128")

	await axios
		.get(domain, { baseURL: FAVICON_GRABBER_API })
		.then((res) => {
			if (res.data?.icons[0]?.src) {
				favicons.push(res.data.icons[0]?.src)
			}
		})
		.catch((_) => {})

	return favicons
}
