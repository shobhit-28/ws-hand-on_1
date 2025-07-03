import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const routerFiles = fs.readdirSync(__dirname).filter(file => file !== 'central.routes.js')

console.log(routerFiles)

for (const file of routerFiles) {
    const route = await import(`./${file}`)
    const routeName = file.replace('.routes.js', '').toLowerCase();
    console.log(route)
    console.log('routeName', routeName)
    router.use(`/${routeName}`, route.default)
}
// console.log(router)
export default router