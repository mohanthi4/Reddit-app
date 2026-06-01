import { Context } from "hono";
import {
  getClassAndCookie,
  getDenoEnv,
  getUsersValidData,
  requestAccessToken,
  requestProtectedResource,
  setParams,
  setUserLogin,
} from "./helpers.ts";

type honoHandler = (data: Context) => Promise<Response>;

export const serveFeedInfo: honoHandler = async (c) => {
  const { userId, readit } = getClassAndCookie(c);
  if (!userId) {
    return c.json({ posts: [], nextId: 1 });
  }
  const { cursor, limit } = await c.req.json();
  const { posts, nextCursor } = await readit.getAllPosts(
    parseInt(cursor),
    parseInt(limit),
  );
  return c.json({ posts: posts, nextCursor });
};

export const serveAddPost: honoHandler = async (c) => {
  const { readit, userId } = getClassAndCookie(c);
  const body = await c.req.json();
  const finalData = {
    userId,
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
  if (!userId) {
    return c.json({ status: false, user: null });
  }
  const user = await users.getUserName(userId);
  return c.json({ status: true, user });
};

export const serveSubcribers = async (c) => {
  const { userId, users } = getClassAndCookie(c);
  if (!userId) {
    return c.json({ all: [], current: 0 });
  }
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

export const serveUnSubscribe = async (c) => {
  const { userId, users } = getClassAndCookie(c);
  const id = await c.req.json();
  const finalData = users.unSubscribe(userId, id);
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

export const serveGithubIdentity = (c) => {
  const url = new URL("https://github.com/login/oauth/authorize");
  const { clientId } = getDenoEnv();
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("scope", "user");
  url.searchParams.set("redirect_uri", "http://localhost:8080/auth");
  return c.redirect(url, 303);
};

export const serveServiceApi = async (c) => {
  const code = c.req.query("code");
  const { clientId, clientSecret } = getDenoEnv();
  const body = setParams(clientId, clientSecret, code);
  const access_token = await requestAccessToken(body);
  const data = await requestProtectedResource(access_token);
  const status = await setUserLogin(c, data);
  return c.redirect("http://localhost:5173");
};
