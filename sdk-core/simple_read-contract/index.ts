import { createTokenClient } from "@ethereum-tag-service/sdk-core";
const chainId = 421614;
const client = createTokenClient({ chainId });
const tag = "#rainbow"; // Edit to your hashtag
const tagExists = await client?.tagExistsByString(tag);
export { tag, tagExists };
