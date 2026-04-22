import { logger } from "hono/logger";
import { Context, Hono } from "hono";

type honoHandler = (data:Context)=>Context

const serveFeedInfo:honoHandler = (c) => {
  const readit = c.get('readit');
  const data = readit.getPosts()
  return c.json(data);
}

export const CreateApp = (data) => {
  const app = new Hono();


  app.use(logger());
  app.use(async(c,next) => {
    c.set('readit', data);
    await next()
  })
  app.get("/get/feedInfo", serveFeedInfo);
  return app;
}


