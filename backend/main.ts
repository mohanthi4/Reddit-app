import { CreateApp } from "./src/app.ts";
import Readit from "./src/readit.ts";
import { MongoClient } from "mongodb";

const initialInfo = {
  _id: 1,
  user: "alex",
  date: new Date().toString(),
  title: "First post",
  description: "welcome to new post",
};

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
  // console.log(data);
  // await postData.insertOne(initialInfo);
  return postData;
};

const main = async () => {
  const postData = await CreateClient();
  const data = new Readit(postData, 2);
  const app = CreateApp(data);
  Deno.serve({ port: 8080 }, app.fetch);
};

main();
