import ReactDOM from "react-dom/client"

import "./global.css"
import 'react-toastify/dist/ReactToastify.css';

import { Provider } from "react-redux"
import { store } from "./redux/store"

import App from "./App"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
	<Provider store={store}>
		<App />
	</Provider>,
)
