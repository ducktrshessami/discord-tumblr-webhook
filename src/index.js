import { getNewPosts, getPostImageURLs } from "./tumblr.js";
import { repost } from "./discord.js";
import { setTimeout } from "timers/promises";
import { QUEUE_INTERVAL } from "./constants.js";

async function queuedPosts(blog, posts) {
    if (!posts.length) {
        console.log("No posts found!");
        return;
    }
    for (let i = 0; i < posts.length; i++) {
        try {
            const post = posts[i];
            const imageUrls = getPostImageURLs(post);
            if (!imageUrls.length) {
                console.log(`Could not find image urls. Skipping ${post.post_url}`);
                continue;
            }
            await repost(blog, post, imageUrls);
            if (i !== posts.length - 1) {
                await setTimeout(QUEUE_INTERVAL);
            }
        }
        catch (err) {
            console.error(err);
        }
    }
}

try {
    console.log(`Fetching posts for blog: ${process.env.TARGET_BLOG}`);
    const { blog, posts } = await getNewPosts();
    await queuedPosts(blog, posts);
    console.log("Done!");
}
catch (err) {
    console.error(err);
}
