import Redis from "ioredis";

const redis = new Redis({
  port: Number(process.env.REDIS_PORT), // Konversi ke number
  host: process.env.REDIS_HOST || "localhost",
  username: process.env.REDIS_USERNAME || "default",
  password: process.env.REDIS_PASSWORD || "",
  db: 0,
});

export default redis;
