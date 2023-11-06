import { Client } from "tumblr.js";
import { JSDOM } from "jsdom";
import { POST_LIMIT } from "./constants.js";
import { getConfig, writeConfig } from "./config.js";

const client = new Client({ consumer_key: process.env.TUMBLR_KEY });

export async function getNewPosts() {
    const config = getConfig();
    const { blog, posts: latestPosts } = await client.blogPosts(process.env.TARGET_BLOG, { limit: POST_LIMIT });
    let posts = latestPosts.filter(post => post.timestamp * 1000 > config.lastChecked).sort((a, b) => a.timestamp - b.timestamp);
    config.lastChecked = Date.now();
    if (!posts.length) {
        const { posts: oldPosts } = await client.blogPosts(process.env.TARGET_BLOG, {
            limit: POST_LIMIT,
            offset: config.pastOffset
        });
        const [filteredPosts, filterCount] = oldPosts.reduce((data, post) => {
            if (post.timestamp * 1000 < config.pastTime) {
                data[0].push(post);
            }
            else {
                data[1]++;
            }
            return data;
        }, [[], 0]);
        posts = filteredPosts.sort((a, b) => b.timestamp - a.timestamp).slice(0, 1);
        config.pastOffset += filterCount || 1;
        config.pastTime = posts.length ? posts[0].timestamp * 1000 : config.pastTime;
    }
    writeConfig(config);
    return { blog, posts };
}

export function getPostImageURLs(post) {
    if (post.type === "photo") {
        return post.photos.map(photo => photo.original_size.url);
    }
    else if (post.body) {
        const dom = new JSDOM(post.body);
        const images = dom.window.document.querySelectorAll("img");
        return Array.from(images.values()).map(image => image.src);
    }
    return [];
}
