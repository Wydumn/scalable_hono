import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import { cache } from "@hono/hono/cache";
import postgres from "postgres";
import RedisCacheMiddleware from "./middleware/redisCache.js"

const REPLICA_ID = crypto.randomUUID();

const app = new Hono();

app.use("*", async (c, next) => {
  c.res.headers.set("X-Replica-Id", REPLICA_ID);
  await next();
});

app.use("/*", cors());
app.use("/*", logger());

app.get(
  "/hello/*",
  RedisCacheMiddleware
)

app.get(
  "/hello/:name",
  async (c) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return c.json({ message: `Hello, ${c.req.param("name")}!` });
  }
)

export default app;