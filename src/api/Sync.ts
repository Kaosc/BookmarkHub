import GDrive from "@googleapis/drive"
import Merge from "../utils/merge"

export default async function Sync(token: string, BookmarkGroups: BookmarkGroups): Promise<BookmarkGroups> {
	const drive = GDrive.drive({ version: "v3", auth: token })

	// get all files from the drive
	const filesData = await drive.files.list({
		fields: "files(id, name)",
	})

	console.log(">>> Retrieved FilesData:", filesData.data.files)

	if (!filesData.data.files?.length) {
		// no file exits upload the current bookmarks
		console.debug(">>> No files found. Uploading current bookmarks")

		uploadBookmarks(token, BookmarkGroups)

		return BookmarkGroups
	} else {
		// file exist, get contents of the file
		console.debug(">>> Files found. Getting bookmarks:")

		const { data: fileContent } = await drive.files.get({
			fileId: filesData.data.files[0].id!,
			alt: "media",
		})

		console.debug(">>> Got bookmarks:")

		// parse the file content
		const parsedFileContent: BookmarkGroups = JSON.parse(fileContent.toString())

		console.debug(">>> Parsed bookmarks:", parsedFileContent)

		// check if the file content is valid
		if (parsedFileContent && parsedFileContent.length) {
			// file content is valid, update the bookmarks
			console.debug(">>> File content is valid. Merging bookmarks")

			// MERGE
			// const mergedBookmarks = await Merge(BookmarkGroups, parsedFileContent)
			uploadBookmarks(token, BookmarkGroups)

			return BookmarkGroups
		} else {
			console.debug(">>> File content is invalid.")

			// file content is invalid, upload the current bookmarks
			uploadBookmarks(token, BookmarkGroups)
			return BookmarkGroups
		}
	}
}

const uploadBookmarks = async (auth: any, bookmarks: BookmarkGroups) => {
	const drive = GDrive.drive({ version: "v3", auth })

	console.log(">>> Uploading bookmarks")

	// get all files from the drive
	const filesData = await drive.files.list({
		fields: "files(id, name)",
	})

	if (!filesData.data.files?.length) {
		console.debug(">>> No files found to update. Creating new file:")

		// no files exits upload the current bookmarks
		const fileContent = JSON.stringify(bookmarks)
		const fileMetadata = {
			name: "bookmarks",
			mimeType: "application/json",
		}

		const media = {
			mimeType: "application/json",
			body: fileContent,
		}

		console.debug(">>> Creating new file with bookmarks:")
		await drive.files
			.create({
				requestBody: fileMetadata,
				media,
				fields: "id",
			})
			.then((res) => {
				console.debug(">>> Created new file with bookmarks:", res)
			})
			.catch((err) => {
				console.error(">>> Error creating new file with bookmarks:", err)
			})
	} else {
		console.debug(">>> Files found. Updating bookmarks:")

		// files exist, get contents of the file
		const { data: fileContent } = await drive.files.get({
			fileId: filesData.data.files[0].id!,
			alt: "media",
		})

		console.debug(">>> Got bookmarks")

		// parse the file content
		const parsedFileContent = JSON.parse(fileContent.toString())

		console.debug(">>> Parsed bookmarks:", parsedFileContent)

		// check if the file content is valid
		if (parsedFileContent && parsedFileContent.length) {
			console.debug(">>> File content is valid. Updating bookmarks")

			// file content is valid, update the bookmarks
			const fileContent = JSON.stringify(bookmarks)
			const fileMetadata = {
				name: "Bookmarks",
				mimeType: "application/json",
			}

			const media = {
				mimeType: "application/json",
				body: fileContent,
			}

			console.debug(">>> Updating bookmarks")

			await drive.files
				.update({
					fileId: filesData.data.files[0].id!,
					requestBody: fileMetadata,
					media,
					fields: "id",
				})
				.then((res) => {
					console.debug(">>> Updated bookmarks:", res)
				})
				.catch((err) => {
					console.error(">>> Error updating bookmarks:", err)
				})
		} else {
			console.debug(">>> File content is invalid. Uploading bookmarks")

			// file content is invalid, upload the current bookmarks
			const fileContent = JSON.stringify(bookmarks)
			const fileMetadata = {
				name: "Bookmarks",
				mimeType: "application/json",
			}

			const media = {
				mimeType: "application/json",
				body: fileContent,
			}

			console.debug(">>> Uploading bookmarks")

			await drive.files
				.create({
					requestBody: fileMetadata,
					media,
					fields: "id",
				})
				.then((res) => {
					console.debug(">>> Uploaded bookmarks:", res)
				})
				.catch((err) => {
					console.error(">>> Error uploading bookmarks:", err)
				})
		}
	}
}
