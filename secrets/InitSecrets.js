const fs = require("fs")
const path = require("path")

const manifestPath = path.join(__dirname, "../public/manifest.json")

const manifest = require(manifestPath)
const secrets = require("./secrets.json")

manifest.oauth2.client_id = secrets.client_id
manifest.key = secrets.key

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

console.log(">>> secrets written to manifest.json")
