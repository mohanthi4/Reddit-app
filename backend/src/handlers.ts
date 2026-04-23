import { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";

type honoHandler = (data: Context) => Promise<Response>;

export const serveFeedInfo: honoHandler = async (c) => {
  const user_id = getCookie(c, "user_id");
  if (user_id) {
    const readit = c.get("postsClass");
    const users = c.get("usersClass");
    const userId = parseInt(user_id);
    // const body = {
    //   userId,
    //   date: "12/3/2024",
    //   title: "hello",
    //   description: "welcome to our new site",
    // };
    // const d = await readit.addPost(body);
    const data = await readit.getPosts(userId);
    const userName = await users.getUserName(userId);
    data.posts.map((ele) => ele.user = userName);
    data.posts.reverse();
    return c.json(data);
  }
};

export const serveAddPost: honoHandler = async (c) => {
  const readit = c.get("postsClass");
  const user_id = getCookie(c, "user_id");
  const userId = parseInt(user_id);
  console.log(user_id)
  const {title,description,date} = await c.req.json();
  const finalData = { title, description, date, userId };
  console.log(finalData)
  const data = await readit.addPost(finalData);
  return c.json(data);
};

export const serveDeletePost: honoHandler = async (c) => {
  const readit = c.get("postsClass");
  const _id = await c.req.json();
  const data = readit.deletePost(_id);
  return c.json(data);
};

export const serveCheckUser = async (c) => {
  const userId = getCookie(c, "user_id");
  const users = c.get("usersClass");
  const user = await users.getUserName(userId);
  console.log(user, "name");

  const { status } = userId ? { status: true } : { status: false };

  return c.json({ status, user });
};

export const serveLoginUser = async (c) => {
  const users = c.get("usersClass");
  const body = await c.req.json();
  const { status, user, id } = await users.addUser(body);
  setCookie(c, "user_id", id);
  return c.json({ status, user });
};
