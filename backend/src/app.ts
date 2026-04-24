import { logger } from "hono/logger";
import { Hono } from "hono";
import { cors } from "hono/cors";
import Readit from "./readit.ts";
import {
  serveAddPost,
  serveAddSubscriber,
  serveCheckUser,
  serveDeletePost,
  serveFeedInfo,
  serveLoginUser,
  serveSubcribers,
} from "./handlers.ts";
import User from "./user.ts";

export const CreateApp = (userData: User, postData: Readit) => {
  const app = new Hono();

  app.use("*", cors({ origin: "http://localhost:5173", credentials: true }));
  app.use(logger());
  app.use(async (c, next) => {
    c.set("postsClass", postData);
    c.set("usersClass", userData);
    await next();
  });
  app.get("/get/feedInfo", serveFeedInfo);
  app.get("/get/checkUser", serveCheckUser);
  app.get("/get/subscribers", serveSubcribers);
  app.post("/post/addSubscriber", serveAddSubscriber);
  app.post("/post/loginUser", serveLoginUser);
  app.post("/post/addPost", serveAddPost);
  app.post("/post/deletePost", serveDeletePost);
  return app;
};
