import postgres from "postgres";
import { Redis } from "ioredis";

const sql = postgres();
const redisConsumer = new Redis(6379, "redis");

const QUEUE_NAME = "users";

const consume = async () => {
  while(true) {
    const result = await redisConsumer.brpop(QUEUE_NAME, 0);
    if (result) {
      const [queue, user] = result;
      const { name } = JSON.parse(user);
      await sql`INSERT INTO users (name) VALUES (${name})`;
    }
  }
}

consume();