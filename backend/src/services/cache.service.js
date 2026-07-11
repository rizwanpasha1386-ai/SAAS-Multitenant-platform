const redis = require("../config/redis")

const DEFAULT_TTL = 5 * 60; // 5 minutes

async function getCache(key) {
  try {
    const cachedValue = await redis.get(key);

    if (!cachedValue) {
      return null;
    }

    return JSON.parse(cachedValue);
  } catch (error) {
    console.error(`Cache GET error for ${key}:`, error.message);

    // Redis failure should not stop the API.
    return null;
  }
}

async function setCache(key, value, ttl = DEFAULT_TTL) {
  try {
    await redis.set(
      key,
      JSON.stringify(value),
      "EX",
      ttl
    );
  } catch (error) {
    console.error(`Cache SET error for ${key}:`, error.message);
  }
}

async function deleteCache(key) {
  try {
    await redis.del(key);
  } catch (error) {
    console.error(`Cache DELETE error for ${key}:`, error.message);
  }
}

async function deleteMultipleCacheKeys(keys) {
  try {
    if (!Array.isArray(keys) || keys.length === 0) {
      return;
    }

    await redis.del(...keys);
  } catch (error) {
    console.error("Multiple cache DELETE error:", error.message);
  }
}

async function deleteCacheByPattern(pattern) {
  try {
    let cursor = "0";

    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100
      );

      cursor = nextCursor;

      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== "0");
  } catch (error) {
    console.error(`Cache pattern DELETE error for ${pattern}:`, error.message);
  }
}

module.exports = {
  getCache,
  setCache,
  deleteCache,
  deleteMultipleCacheKeys,
  deleteCacheByPattern,
}