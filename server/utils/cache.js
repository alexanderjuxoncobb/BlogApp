import NodeCache from "node-cache";

// Create cache instances with different TTLs
const usersCache = new NodeCache({ stdTTL: 300 }); // 5 minutes
const postsCache = new NodeCache({ stdTTL: 120 }); // 2 minutes
const commentsCache = new NodeCache({ stdTTL: 120 }); // 2 minutes

export { usersCache, postsCache, commentsCache };
