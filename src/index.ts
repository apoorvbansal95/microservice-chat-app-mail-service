import express from "express"
import dotenv from "dotenv"
import { startSendOtpConsumer } from "./consumer.js"
dotenv.config()
startSendOtpConsumer()
const app = express()

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server for mail service runnign on port #${PORT}`)
})
