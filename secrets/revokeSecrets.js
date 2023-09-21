const fs = require("fs")
const path = require("path")

const manifestPath = path.join(__dirname, "../public/manifest.json")

const manifest = require(manifestPath)

manifest.oauth2.client_id = ""
manifest.key = ""

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

console.log(">>> secrets removed from manifest.json")
