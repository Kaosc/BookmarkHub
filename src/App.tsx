import { useEffect } from "react"
import { useSelector } from "react-redux"
import { ToastContainer } from "react-toastify"

import Home from "./pages/Home"
import Navbar from "./components/Navbar"

import { storeBookmarks } from "./utils/localStorage"
import Search from "./pages/Search"

export default function App() {
	const bookmarks = useSelector((state: RootState) => state.bookmarks)

	useEffect(() => {
		// localStorage.clear()
		storeBookmarks(bookmarks)
	}, [bookmarks])

	return (
		<main className="flex bg-gradient-to-r from-zinc-950 to-black">
			<Navbar />
			<Home />
			<Search />
			<ToastContainer/>
		</main>
	)
}
