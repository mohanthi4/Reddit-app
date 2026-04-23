import { CreateApp } from "./src/app.ts";
import { createClient } from "./src/persistence.ts";
import Readit from "./src/readit.ts";
import User from "./src/user.ts";

const main = async () => {
  const { postInfo, userInfo } = await createClient();
  const userData = new Readit(userInfo.postData, userInfo.length);
  const postData = new User(postInfo.postData, postInfo.length);
  const app = CreateApp(userData,postData);
  Deno.serve({ port: 8080 }, app.fetch);
};

main();
