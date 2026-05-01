import { getCookie, setCookie } from "hono/cookie";

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
  return { user: login, _id: +id };
};

export const setUserLogin = async (c, body) => {
  const users = c.get("usersClass");
  const isExist = await users.isUserExist(body._id);
  let status = true;
  if (!isExist) {
    status = await users.addUser(body);
  }
  setCookie(c, "user_id", body._id);
  return status;
};

export const setParams = (clientId, clientSecret, code) => {
  const body = new URLSearchParams();
  body.set("client_id", clientId);
  body.set("client_secret", clientSecret);
  body.set("code", code);
  return body;
};

export const getDenoEnv = () => {
  const clientId = Deno.env.get("AUTH_CLIENT_ID");
  const clientSecret = Deno.env.get("AUTH_CLIENT_SECRET");
  return { clientId, clientSecret };
};

export const getClassAndCookie = (c) => {
  const user_id = getCookie(c, "user_id");
  return {
    readit: c.get("postsClass"),
    users: c.get("usersClass"),
    userId: parseInt(user_id),
  };
};
