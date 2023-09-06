import { Client } from "tumblr.js";
import { JSDOM } from "jsdom";
import { POST_LIMIT } from "./constants.js";

const client = new Client({ consumer_key: process.env.TUMBLR_KEY });

export async function getNewPosts() {
    return await client.blogPosts(process.env.TARGET_BLOG, { limit: POST_LIMIT });
}

export function getPostImageURLs(post) {
    const dom = new JSDOM(post.body);
    const images = dom.window.document.querySelectorAll("img");
    return Array.from(images.values()).map(image => image.src);
}
