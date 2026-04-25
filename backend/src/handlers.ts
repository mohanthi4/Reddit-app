import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { getFinalPosts, getUsersValidData, UserIdCookie } from "./helpers.ts";

type honoHandler = (data: Context) => Promise<Response>;

const getClassAndCookie = (c) => {
  return {
    readit: c.get("postsClass"),
    users: c.get("usersClass"),
    userId: UserIdCookie(c),
  };
};

export const serveFeedInfo: honoHandler = async (c) => {
  const { userId, readit, users } = getClassAndCookie(c);
  if (userId) {
    const ids = await users.userSubcribres(userId);
    ids.push(userId);
    const content = await readit.getAllPosts(ids);
    const finalPosts = await getFinalPosts(content, users);
    return c.json(finalPosts);
  }
};

export const serveAddPost: honoHandler = async (c) => {
  const readit = c.get("postsClass");
  const body = await c.req.json();
  const finalData = {
    userId: UserIdCookie(c),
    ...body,
  };
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
  const { userId, users } = getClassAndCookie(c);
  const user = await users.getUserName(userId);
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

export const serveSubcribers = async (c) => {
  const { userId, users } = getClassAndCookie(c);
  const allUsers = await users.getAllUsers(userId);
  const subscribers = await users.userSubcribres(userId);
  const finalData = getUsersValidData(allUsers, subscribers);
  return c.json({ all: finalData, current: userId });
};

export const serveAddSubscriber = async (c) => {
  const { userId, users } = getClassAndCookie(c);
  const id = await c.req.json();
  const finalData = users.addSubscriber(userId, id);
  return c.json(finalData);
};

export const serveAddLike = async (c) => {
  const { userId, readit } = getClassAndCookie(c);
  const id = await c.req.json();
  const data = await readit.addLike(userId, id);
  return c.json(data);
};

export const serveUnLike = async (c) => {
  const { userId, readit } = getClassAndCookie(c);
  const id = await c.req.json();
  const data = await readit.unLike(userId, id);
  return c.json(data);
};
