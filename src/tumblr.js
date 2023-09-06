import { Client } from "tumblr.js";
import { JSDOM } from "jsdom";
import { POST_LIMIT } from "./constants.js";
import { getLastTimestamp, writeTimestamp } from "./config.js";

const client = new Client({ consumer_key: process.env.TUMBLR_KEY });

export async function getNewPosts() {
    const lastTimestamp = getLastTimestamp();
    const { blog, posts } = await client.blogPosts(process.env.TARGET_BLOG, { limit: POST_LIMIT });
    writeTimestamp();
    return {
        blog,
        posts: posts.filter(post => post.timestamp * 1000 > lastTimestamp).sort((a, b) => a.timestamp - b.timestamp)
    };
}

export function getPostImageURLs(post) {
    const dom = new JSDOM(post.body);
    const images = dom.window.document.querySelectorAll("img");
    return Array.from(images.values()).map(image => image.src);
}
