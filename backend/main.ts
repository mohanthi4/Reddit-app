import { CreateApp } from "./src/app.ts";
import { createClient } from "./src/persistence.ts";
import Readit from "./src/readit.ts";

const main = async () => {
  const { postData, length } = await createClient();
  const data = new Readit(postData, length);
  const app = CreateApp(data);
  Deno.serve({ port: 8080 }, app.fetch);
};

main();
