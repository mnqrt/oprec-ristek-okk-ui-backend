import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import mongoose from "mongoose"
import cors from "cors"
import authRouter from "./routes/auth.router"
import kelompokOKKRouter from "./routes/kelompokOKK.router"
import panitiaOKKRouter from "./routes/panitiaOKK.router"
import sponsorOKKRouter from "./routes/sponsorOKK.router"
import acaraRouter from "./routes/acaraOKK.router"
import pembicaraOKKRouter from "./routes/pembicaraOKK.router"

dotenv.config()

const app: Express = express()
const port = process.env.port || 4000

const MONGO_URL: string = process.env.DATABASE_URL || 'mongodb://localhost/okk-ui-backend'
mongoose.connect(MONGO_URL)
const db = mongoose.connection
db.once('open', () => console.log("Connected to Mongoose"))

app.use(cookieParser())
app.use( cors({ origin: 'http://localhost:3000', credentials: true,}) )
app.use(express.json())

app.use('/auth', authRouter)
app.use('/mentoring', kelompokOKKRouter)
app.use('/rapat', panitiaOKKRouter)
app.use('/sponsor', sponsorOKKRouter)
app.use('/acara', acaraRouter)
app.use('/pembicara', pembicaraOKKRouter)

app.listen(port, () => console.log(`[server]: Server is running at http://localhost:${port}`))