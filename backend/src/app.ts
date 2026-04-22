import { logger } from "hono/logger";
import { Hono } from "hono";
import { cors } from "hono/cors";
import Readit from "./readit.ts";
import { serveAddPost, serveDeletePost, serveFeedInfo } from "./handlers.ts";

export const CreateApp = (data: Readit) => {
  const app = new Hono();

  app.use("*", cors());
  app.use(logger());
  app.use(async (c, next) => {
    c.set("postsClass", data);
    await next();
  });
  app.get("/get/feedInfo", serveFeedInfo);
  app.post("/post/addPost", serveAddPost);
  app.post("/post/deletePost", serveDeletePost);
  return app;
};
