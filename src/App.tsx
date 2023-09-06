import { useEffect } from "react"
import { useSelector } from "react-redux"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import { storeBookmarks } from "./utils/localStorage"

export default function App() {
	const bookmarks = useSelector((state: StoreRootState) => state.bookmarks)

	useEffect(() => {
		storeBookmarks(bookmarks)
	}, [bookmarks])

	return (
		<main className="bg-gradient-to-r from-zinc-950 to-zinc-900">
			<Navbar />
			<Home />
		</main>
	)
}
