import dotenv from "./dotenv.js";

await dotenv();

export const QUEUE_INTERVAL = process.env.QUEUE_INTERVAL ? parseInt(process.env.QUEUE_INTERVAL) : 60000;
