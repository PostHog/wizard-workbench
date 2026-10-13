import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { links } from "./routes/links";
import { getLink } from "./store";
import type { AppEnv } from "./types";

const app = new Hono<AppEnv>();

app.use(logger());

app.get("/", (c) =>
  c.json({ service: "cf-worker-hono", environment: c.env.ENVIRONMENT }),
);

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/api/links", links);

app.get("/:slug", (c) => {
  const link = getLink(c.req.param("slug"));
  if (!link) {
    throw new HTTPException(404, { message: "link not found" });
  }
  return c.redirect(link.url, 302);
});

app.notFound((c) => c.json({ error: "Not Found" }, 404));

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  console.error(`${c.req.method} ${c.req.path} failed:`, err);
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
