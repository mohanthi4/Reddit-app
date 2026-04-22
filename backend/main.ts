import { CreateApp } from "./src/app.ts";
import Readit from "./src/readit.ts";

const initialInfo = {
    id: 1,
    user: "alex",
    date: new Date().toString(),
    title: "First post",
    description: "welcome to new post",
};
  
const main = () => {
  const data = new Readit(initialInfo,2);
  const app = CreateApp(data);
  Deno.serve({port:8080},app.fetch)
}

main()