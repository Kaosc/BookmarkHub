import { useEffect } from "react"
import { useSelector } from "react-redux"
import { ToastContainer } from "react-toastify"

import Home from "./pages/Home"
import Navbar from "./components/Navbar"

import { storeBookmarks } from "./utils/localStorage"
import Search from "./pages/Search"
import Settings from "./pages/Settings"

export default function App() {
	const bookmarks = useSelector((state: RootState) => state.bookmarks)

	useEffect(() => {
		// localStorage.clear()
		storeBookmarks(bookmarks)
	}, [bookmarks])

	return (
		<main className="flex">
			<Navbar />
			<Home />
			<Search />
			<Settings />
			<ToastContainer />
		</main>
	)
}
