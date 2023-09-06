import dotenv from "./dotenv.js";

await dotenv();

export const QUEUE_INTERVAL = envInt("QUEUE_INTERVAL", 60000);
export const POST_LIMIT = envInt("POST_LIMIT", 20);

function envInt(env, defaultValue) {
    return process.env[env] ? parseInt(process.env[env]) : defaultValue;
}
