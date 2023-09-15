/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js,ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {},
	},
	plugins: [require("tailwindcss-animate")],
}
