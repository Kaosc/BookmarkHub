import { ToastContainer } from "react-toastify"

import Home from "./pages/Home"
import Navbar from "./components/Navbar"

import Search from "./pages/Search"
import Settings from "./pages/Settings"

export default function App() {
	return (
		<main className="flex from-zinc-200 to-zinc-50 dark:from-[#0e0e0e] dark:to-zinc-950">
			<Navbar />
			<Search />
			<Home />
			<Settings />
			<ToastContainer />
		</main>
	)
}
