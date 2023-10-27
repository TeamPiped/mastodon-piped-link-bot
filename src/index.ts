import { createStreamingAPIClient, createRestAPIClient } from "masto";
import { getPipedLinks } from "./utils.js";

const streamingUrl: string = process.env.STREAMING_URL!;
const restUrl: string = process.env.REST_URL!;
const accessToken: string = process.env.ACCESS_TOKEN!;

const streamingClient = createStreamingAPIClient({
    streamingApiUrl: streamingUrl,
    accessToken: accessToken,
});

const restClient = createRestAPIClient({
    url: restUrl,
    accessToken: accessToken,
});

for await (const event of streamingClient.public.subscribe()) {
    if (event.event === "update") {
        const pipedLinks = getPipedLinks(event.payload.content);
        if (pipedLinks.length > 0) {
            await restClient.v1.statuses
                .create({
                    status: `Here is an alternative Piped link(s): \n\n${pipedLinks.join(
                        "\n\n",
                    )}\n\nPiped is a privacy-respecting open-source alternative frontend to YouTube.\n\nI'm open-source; check me out at https://github.com/TeamPiped/mastodon-piped-link-bot.`,
                    visibility: "unlisted",
                    inReplyToId: event.payload.id,
                })
                .then(res => {
                    console.log(`Status URL: ${res.url}`);
                });
        }
    }
}
