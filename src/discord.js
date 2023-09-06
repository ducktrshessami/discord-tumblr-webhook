import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import "./constants.js";

const rest = new REST();

function resolveColor(str) {
    const result = str.match(/^#([\dA-F]{6})$/i);
    return result ? parseInt(result[1], 16) : null;
}

function createPostEmbed(blog, post, url) {
    return {
        description: post.summary,
        url: post.post_url,
        timestamp: new Date(post.timestamp * 1000).toISOString(),
        color: resolveColor(blog.theme.background_color),
        image: { url },
        author: {
            name: blog.name,
            url: post.post_url
        }
    };
}

export async function repost(blog, post, imageUrls) {
    if (!imageUrls.length) {
        return;
    }
    console.log(`Reposting: ${post.post_url}`);
    await rest.post(Routes.webhook(process.env.DISCORD_WEBHOOK_ID, process.env.DISCORD_WEBHOOK_TOKEN), {
        auth: false,
        body: {
            username: blog.title,
            avatar_url: blog.avatar[0]?.url,
            embeds: imageUrls.map(url => createPostEmbed(blog, post, url))
        }
    });
}
