import {
    existsSync,
    readFileSync,
    writeFileSync
} from "fs";
import { fileURLToPath } from "url";

const path = fileURLToPath(new URL("../config.json", import.meta.url));

export function getConfig() {
    try {
        if (existsSync(path)) {
            const config = JSON.parse(readFileSync(path, { encoding: "utf8" }));
            return {
                lastChecked: new Date(config.last_checked).getTime(),
                pastOffset: config.past_offset,
                pastTime: new Date(config.past_time).getTime()
            };
        }
    }
    catch (err) {
        console.log(err);
        console.log("Failed to read config");
    }
    const now = Date.now();
    return {
        lastChecked: now,
        pastOffset: 0,
        pastTime: now
    };
}

export function writeConfig({ lastChecked, pastOffset, pastTime } = {}) {
    lastChecked ??= new Date();
    pastOffset ??= 0;
    pastTime ??= new Date();
    writeFileSync(path, `{ "last_checked": "${lastChecked.toISOString()}", "past_offset": ${pastOffset}, "past_time": "${pastTime.toISOString()}" }\n`, { encoding: "utf8" });
}
