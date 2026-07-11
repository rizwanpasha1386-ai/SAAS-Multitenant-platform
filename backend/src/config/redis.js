const { Redis } = require("ioredis")

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6380,
  db: Number(process.env.REDIS_DB) || 0,

  retryStrategy(times) {
    return Math.min(times * 100, 3000);
  },
})

redis.on("connect", () => {
  console.log("Redis connection established");
})

redis.on("ready", () => {
  console.log("Redis is ready");
})

redis.on("error", (error) => {
  console.error("Redis error:", error.message);
});

module.exports = redis