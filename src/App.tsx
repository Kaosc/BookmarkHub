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
		storeBookmarks(bookmarks)
	}, [bookmarks])

	return (
		<main className="flex from-zinc-200 to-zinc-50 dark:from-[#0e0e0e] dark:to-zinc-950">
			<Navbar />
			<Home />
			<Search />
			<Settings />
			<ToastContainer />
		</main>
	)
}
