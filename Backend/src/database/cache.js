import Redis from "ioredis";
import { config } from "../config/config.js";

const redis = new Redis({
  port: config.REDIS_PORT,
  host: config.REDIS_HOST,
  password: config.REDIS_PASSWORD,
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.log("Redis error:", err);
});

export default redis;
