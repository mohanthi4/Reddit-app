import { getCookie } from "hono/cookie";

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
