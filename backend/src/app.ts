import { logger } from "hono/logger";
import { Hono } from "hono";
import { cors } from "hono/cors";
import Readit from "./readit.ts";
import {
  serveAddLike,
  serveAddPost,
  serveAddSubscriber,
  serveCheckUser,
  serveDeletePost,
  serveFeedInfo,
  serveGithubIdentity,
  serveServiceApi,
  serveSubcribers,
  serveUnLike,
  serveUnSubscribe,
} from "./handlers.ts";
import User from "./user.ts";

export const CreateApp = (
  userData: User,
  postData: Readit,
) => {
  const app = new Hono();

  app.use("*", cors({ origin: "http://localhost:5173", credentials: true }));
  app.use(logger());
  app.use(async (c, next) => {
    c.set("postsClass", postData);
    c.set("usersClass", userData);
    await next();
  });
  app.get("/get/handleAuthLogin", serveGithubIdentity);
  app.get("/auth", serveServiceApi);
  app.get("/get/feedInfo", serveFeedInfo);
  app.get("/get/checkUser", serveCheckUser);
  app.get("/get/subscribers", serveSubcribers);
  app.post("/post/addLike", serveAddLike);
  app.post("/post/unLike", serveUnLike);
  app.post("/post/addSubscriber", serveAddSubscriber);
  app.post("/post/unSubscriber", serveUnSubscribe);
  // app.post("/post/loginUser", setUserLogin);
  app.post("/post/addPost", serveAddPost);
  app.post("/post/deletePost", serveDeletePost);
  return app;
};
