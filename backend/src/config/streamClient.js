import { StreamClient } from '@stream-io/node-sdk'
import dotenv from "dotenv"
dotenv.config()

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

let streamClient = null

if (apiKey && apiSecret) {
    streamClient = new StreamClient(apiKey, apiSecret)
} else {
    console.warn("Stream.io API keys not configured. Video calling will be unavailable.")
}

export { streamClient, apiKey, apiSecret }
