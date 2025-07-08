import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { wrapRouter } from '../utils/wrapRoutes.js'
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const routerFiles = fs.readdirSync(__dirname).filter(file => file !== 'central.routes.js')

for (const file of routerFiles) {
    const route = await import(`./${file}`)
    const rawRouter = route.default
    const wrappedRouter = wrapRouter(rawRouter, asyncHandler)
    const routeName = file.replace('.routes.js', '').toLowerCase();
    router.use(`/${routeName}`, wrappedRouter)
}

export default router