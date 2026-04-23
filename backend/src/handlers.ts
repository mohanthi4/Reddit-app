import { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";

type honoHandler = (data: Context) => Promise<Response>;

export const serveFeedInfo: honoHandler = async (c) => {
  const readit = c.get("postsClass");
  const data = await readit.getPosts();
  data.posts.reverse();
  return c.json(data);
};

export const serveAddPost: honoHandler = async (c) => {
  const readit = c.get("postsClass");
  const body = await c.req.json();
  const data = readit.addPost(body);
  return c.json(data);
};

export const serveDeletePost: honoHandler = async (c) => {
  const readit = c.get("postsClass");
  const _id = await c.req.json();
  const data = readit.deletePost(_id);
  return c.json(data);
};

export const serveCheckUser = (c) => {
  const userId = getCookie(c, "user_id");
  const { status, user } = userId
    ? { status: true, user: "Alex" }
    : { status: false, user: "" };

  return c.json({ status, user });
};
