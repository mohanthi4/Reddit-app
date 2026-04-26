import { setCookie } from "hono/cookie";

const attachUserToPosts = async (content, users) => {
  return await Promise.all(
    content.posts.map(async (ele) => {
      const userName = await users.getUserName(ele.userId);
      return {
        ...ele,
        user: userName,
      };
    }),
  );
};

export const getFinalPosts = async (content, users) => {
  const finalData = {};
  finalData.posts = await attachUserToPosts(content, users);
  finalData.nextId = content.nextId;
  finalData.posts.reverse();
  return finalData;
};

export const getUsersValidData = (users, subscribers) => {
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

export const requestAccessToken = async (body) => {
  const res = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      body,
      method: "post",
      headers: { Accept: "application/json " },
    },
  );
  const { access_token } = await res.json();
  return access_token;
};

export const requestProtectedResource = async (access_token) => {
  const res2 = await fetch("https://api.github.com/user", {
    method: "get",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const { login, id } = await res2.json();
  console.log("respone --> ", login, id);
  return { user: login, _id: id };
};

export const setUserLogin = async (c, body) => {
  const users = c.get("usersClass");
  const { status, user, id } = await users.addUser(body);
  setCookie(c, "user_id", id);
  console.log(status, user);
  return c.json({ status, user });
};

export const setParams = (clientId, clientSecret, code) => {
  const body = new URLSearchParams();
  body.set("client_id", clientId);
  body.set("client_secret", clientSecret);
  body.set("code", code);
  return body;
};
