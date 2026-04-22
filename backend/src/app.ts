import { logger } from "hono/logger";
import { Context, Hono } from "hono";
import { cors } from "hono/cors";

type honoHandler = (data: Context) => Context;

const serveFeedInfo: honoHandler = async (c) => {
  const readit = c.get("readit");
  const data = await readit.getPosts();
  data.posts.reverse();
  return c.json(data);
};

const serveAddFeedInfo: honoHandler = async (c) => {
  const readit = c.get("readit");
  const body = await c.req.json();
  const data = readit.addPosts(body);
  return c.json(data);
};

const serveDeleteFeedInfo: honoHandler = async (c) => {
  const readit = c.get("readit");
  const _id = await c.req.json();
  const data = readit.deletePosts(_id);
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
  app.post("/post/addPost", serveAddFeedInfo);
  app.post("/post/deletePost", serveDeleteFeedInfo);
  return app;
};
