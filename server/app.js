import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import { cache } from "@hono/hono/cache";
import { serveStatic } from "@hono/hono/deno";
import postgres from "postgres";
import { Redis } from "ioredis";
import RedisCacheMiddleware from "./middleware/redisCache.js"
import { streamSSE } from "@hono/hono/streaming"

const REPLICA_ID = crypto.randomUUID();

const app = new Hono();
const sql = postgres();

app.use(cors());

const redisProducer = new Redis(6379, "redis");

const QUEUE_NAME = "users";


app.use("*", async (c, next) => {
  c.res.headers.set("X-Replica-Id", REPLICA_ID);
  await next();
});

app.use("/*", logger());

app.get(
  "/hello/*",
  RedisCacheMiddleware
)

app.post(
  "/users",
  async (c) => {
    const { name } = await c.req.json();
    await redisProducer.lpush(QUEUE_NAME, JSON.stringify({ name }));
    c.status(202);
    return c.body("Accepted");
  }
)
app.use(cors());

/* app.get("/api/pings/stream", (c) => {
  return streamSSE(c, async (stream) => {
    while(true) {
      await stream.writeSSE({
        data: `ping ${Date.now()}`,
      });
      await stream.sleep(1000);
    }
  })
}) */
app.get("/api/lgtm-test", (c) => {
  console.log("Hello log collection :");
  return c.json({ message: "Hello, world!" });
})

export default app;