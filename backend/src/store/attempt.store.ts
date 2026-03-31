import { Redis } from "ioredis";

export const attemptRedis = new Redis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
//   enableReadyCheck: false
});