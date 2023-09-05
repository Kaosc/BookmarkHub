import { useSelector } from "react-redux"

export default function Home() {
	const bookmarks = useSelector((state: StoreRootState) => state.bookmarks)

	console.log(bookmarks)

	return <div>Home</div>
}
