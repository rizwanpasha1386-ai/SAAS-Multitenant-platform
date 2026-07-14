const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL, {
  retryStrategy(times) {
    return Math.min(times * 100, 3000);
  },
});

redis.on("connect", () => {
  console.log("Redis connection established");
});

redis.on("ready", () => {
  console.log("Redis is ready");
});

redis.on("error", (error) => {
  console.error("Redis error:", error.message);
});

module.exports = redis;