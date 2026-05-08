import { Meilisearch } from "meilisearch";

const meiliClient = new Meilisearch({
    host: process.env.MEILISEARCH_HOST as string,
    apiKey: process.env.MEILISEARCH_API_KEY as string,
});

export default meiliClient;