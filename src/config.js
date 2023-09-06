import {
    existsSync,
    readFileSync,
    writeFileSync
} from "fs";
import { fileURLToPath } from "url";

const path = fileURLToPath(new URL("../config.json", import.meta.url));

export function getLastTimestamp() {
    if (existsSync(path)) {
        const config = JSON.parse(readFileSync(path, { encoding: "utf8" }));
        return new Date(config.last_checked).getTime();
    }
    return Date.now();
}

export function writeTimestamp(timestamp = new Date()) {
    writeFileSync(path, `{ "last_checked": "${timestamp.toISOString()}" }\n`, { encoding: "utf8" });
}
