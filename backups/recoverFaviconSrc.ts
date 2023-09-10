	// //////////////////////////////////////////////////////////////////
	// ////////////////// Recover favicon if not found //////////////////

	// const imgReqSuccesAPI = useRef([
	// 	{
	// 		name: "google",
	// 		endpoint: GOOGLE_FAVICON_API,
	// 		success: false,
	// 	},
	// 	{
	// 		name: "duck",
	// 		endpoint: DUCK_FAVICON_API,
	// 		success: false,
	// 	},
	// 	{
	// 		name: "iconhorse",
	// 		endpoint: ICON_HORSE_API,
	// 		success: false,
	// 	},
	// ])

	// const handleOnImageLoadError = (e: any | undefined) => {
	// 	if (!e) return

	// 	const domain = cleanURL(e.currentTarget.src)
	// 	let updatedSrc = url

	// 	imgReqSuccesAPI.current.forEach((api) => {
	// 		if (!api.success) {
	// 			if (api.name === "google") {
	// 				updatedSrc = `${api.name}${domain}&sz=128`
	// 			} else if (api.name === "duck") {
	// 				updatedSrc = `${api.name}${domain}.ico`
	// 			} else if (api.name === "iconhorse") {
	// 				updatedSrc = `${api.name}${domain}`
	// 			}
	// 		}
	// 	})

	// 	e.currentTarget.src = updatedSrc

	// 	dispatch(
	// 		editBookmark({
	// 			bookmark: {
	// 				...bookmark,
	// 				favicon: updatedSrc,
	// 			},
	// 		}),
	// 	)
	// }

	// const handleOnImageLoaded = (e: any | undefined) => {
	// 	setImageLoading(false)

	// 	if (!e) return

	// 	imgReqSuccesAPI.current.forEach((api) => {
	// 		if (e.currentTarget.src.includes(api.name)) {
	// 			api.success = true
	// 		}
	// 	})
	// }

	// ////////////////// Recover favicon if not found //////////////////
	// //////////////////////////////////////////////////////////////////