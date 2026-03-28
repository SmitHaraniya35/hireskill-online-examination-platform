import { Queue } from "bullmq";
import { attemptRedis } from "../store/attempt.store.ts";

export const attemptQueue = new Queue("attempt-queue", {
  connection: attemptRedis,
});