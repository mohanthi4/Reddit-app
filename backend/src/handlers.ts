import { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";

type honoHandler = (data: Context) => Promise<Response>;

export const serveFeedInfo: honoHandler = async (c) => {
  const user_id = getCookie(c, "user_id");
  // const user_id = 1;
  if (user_id) {
    const readit = c.get("postsClass");
    const users = c.get("usersClass");
    const userId = parseInt(user_id);
    const ids = await users.userSubcribres(userId);
    ids.push(userId);
    console.log(ids, "ids means subscribers");
    const content = await readit.getAllPosts(ids);
    const finalData = {};
    finalData.posts = await Promise.all(
      content.posts.map(async (ele) => {
        const userName = await users.getUserName(ele.userId);
        return {
          ...ele,
          user: userName,
        };
      }),
    );
    finalData.nextId = content.nextId;
    finalData.posts.reverse();
    console.log(finalData, "---> feed data");
    return c.json(finalData);
  }
};

export const serveAddPost: honoHandler = async (c) => {
  const readit = c.get("postsClass");
  const user_id = getCookie(c, "user_id");
  const userId = parseInt(user_id);
  const { title, description, date } = await c.req.json();
  const finalData = { title, description, date, userId };
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

const getUsersValidData = (users, subscribers) => {
  return users.map((user) => {
    const creator = user;
    creator.isSubscribe = subscribers.includes(user._id);
    return {
      id: creator._id,
      user: creator.user,
      isSubscribe: creator.isSubscribe,
    };
  });
};

export const serveSubcribers = async (c) => {
  const user_id = getCookie(c, "user_id");
  const userId = parseInt(user_id);
  const users = c.get("usersClass");
  const allUsers = await users.getAllUsers(userId);
  const subscribers = await users.userSubcribres(userId);
  const finalData = getUsersValidData(allUsers, subscribers);
  return c.json({ all: finalData, current: userId });
};

export const serveAddSubscriber = async (c) => {
  const user_id = getCookie(c, "user_id");
  const userId = parseInt(user_id);
  const users = c.get("usersClass");
  const id = await c.req.json();

  const finalData = users.addSubscriber(userId, id);
  return c.json(finalData);
};

export const serveAddLike = async (c) => {
  const user_id = getCookie(c, "user_id");
  const userId = parseInt(user_id);
  // const userId = 1;
  const readit = c.get("postsClass");
  const id = await c.req.json();
  const data = await readit.addLike(userId, id);
  console.log("--> data", data);
  return c.json(data);
};

export const serveUnLike = async (c) => {
  const user_id = getCookie(c, "user_id");
  const userId = parseInt(user_id);
  // const userId = 1;
  const readit = c.get("postsClass");
  const id = await c.req.json();
  // const id = 2;
  const data = await readit.unLike(userId, id);
  console.log("--> data", data);
  return c.json(data);
};
