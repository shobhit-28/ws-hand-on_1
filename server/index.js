import dotenv from 'dotenv'
import { startServer } from './server.js'

dotenv.config()

await startServer()