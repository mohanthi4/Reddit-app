import { CreateApp } from "./src/app.ts";
import Readit from "./src/readit.ts";
import { MongoClient } from "mongodb";

interface PostsSchema {
  _id: number;
  user: string;
  date: string;
  title: string;
  description: string;
}

const CreateClient = async () => {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  await client.connect();
  const db = client.db("readit");
  const postData = db.collection<PostsSchema>("Alex-posts");
  const data = await postData.find({}).toArray();
  const length = data[data.length - 1]._id + 1;
  return { postData, length };
};

const main = async () => {
  const { postData, length } = await CreateClient();
  const data = new Readit(postData, length);
  const app = CreateApp(data);
  Deno.serve({ port: 8080 }, app.fetch);
};

main();
