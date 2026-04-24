import { CreateApp } from "./src/app.ts";
import { createClient } from "./src/persistence.ts";
import Readit from "./src/readit.ts";
import User from "./src/user.ts";
import PostLikes from "./src/post-likes.tsx";

const main = async () => {
  const { postInfo, userInfo, postLikesInfo } = await createClient();
  const userData = new User(userInfo.userData, userInfo.length);
  const postData = new Readit(postInfo.postData, postInfo.length);
  const postlLikesData = new PostLikes(
    postLikesInfo.postLikes,
    postLikesInfo.length,
  );
  const app = CreateApp(userData, postData, postlLikesData);
  Deno.serve({ port: 8080 }, app.fetch);
};

main();
