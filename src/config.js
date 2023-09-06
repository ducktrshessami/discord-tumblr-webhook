import {
    existsSync,
    readFileSync,
    writeFileSync
} from "fs";
import { fileURLToPath } from "url";

const path = fileURLToPath(new URL("../config.json", import.meta.url));

export function getLastTimestamp() {
    try {
        if (existsSync(path)) {
            const config = JSON.parse(readFileSync(path, { encoding: "utf8" }));
            return new Date(config.last_checked).getTime();
        }
    }
    catch (err) {
        console.log(err);
        console.log("Failed to read last_checked config");
    }
    return Date.now();
}

export function writeTimestamp(timestamp = new Date()) {
    writeFileSync(path, `{ "last_checked": "${timestamp.toISOString()}" }\n`, { encoding: "utf8" });
}
