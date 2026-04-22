import { logger } from "hono/logger";
import { Context, Hono } from "hono";
import { cors } from "hono/cors";

type honoHandler = (data: Context) => Context;

const serveFeedInfo: honoHandler = (c) => {
  const readit = c.get("readit");
  const data = readit.getPosts();
  return c.json(data);
};

export const CreateApp = (data) => {
  const app = new Hono();

  app.use("*", cors());
  app.use(logger());
  app.use(async (c, next) => {
    c.set("readit", data);
    await next();
  });
  app.get("/get/feedInfo", serveFeedInfo);
  return app;
};
