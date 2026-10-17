import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { getLink, listLinks, saveLink } from "../store";
import type { AppEnv } from "../types";

const SLUG_PATTERN = /^[a-z0-9-]{2,32}$/;

export const links = new Hono<AppEnv>();

links.get("/", (c) => c.json({ links: listLinks() }));

links.post("/", async (c) => {
  const body = await c.req.json<{ slug?: string; url?: string }>();
  if (!body.slug || !SLUG_PATTERN.test(body.slug)) {
    throw new HTTPException(400, {
      message: "slug must match [a-z0-9-]{2,32}",
    });
  }
  if (!body.url || !URL.canParse(body.url)) {
    throw new HTTPException(400, { message: "url must be an absolute URL" });
  }
  if (getLink(body.slug)) {
    throw new HTTPException(409, { message: `slug ${body.slug} is taken` });
  }
  return c.json(saveLink(body.slug, body.url), 201);
});

links.get("/:slug/stats", (c) => {
  const link = getLink(c.req.param("slug"));
  if (!link) {
    throw new HTTPException(404, { message: "link not found" });
  }
  const ageDays = (Date.now() - Date.parse(link.createdAt)) / 86_400_000;
  if (ageDays > 30) {
    throw new Error(
      `Stats for ${link.slug} have been archived to cold storage`,
    );
  }
  return c.json({
    slug: link.slug,
    clicks: link.clicks,
    clicksPerDay: Number((link.clicks / Math.max(ageDays, 1)).toFixed(2)),
  });
});
