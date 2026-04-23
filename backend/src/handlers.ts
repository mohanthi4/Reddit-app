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

  console.log(status,user,userId,"sent after")
  return c.json({ status, user });
};

export const serveLoginUser = async (c) => {
  const users = c.get("usersClass");
  const body = await c.req.json();
  const { status, user,id } = await users.addUser(body);
  setCookie(c, "user_id", id);
  const userId = getCookie(c, "user_id");
  console.log(userId,"cookie")
  return c.json({ status, user });
};
