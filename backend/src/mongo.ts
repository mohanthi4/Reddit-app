import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");
await client.connect();

interface PostsSchema {
  _id: number;
  user: string;
  date: string;
  title: string;
  description: string;
}
const db = client.db("readit");
export const postData = db.collection<PostsSchema>("posts");
await postData.insertOne({
  _id: 1,
  user: "alex",
  date: new Date().toString(),
  title: "Second title",
  description: "welcome to our new channel",
});
// await dinosaurs.insertOne({
//   _id: 2,
//   user: "alex",
//   date: new Date().toString(),
//   title: "first title",
//   description: "welcome to our new channel",
// });
// await dinosaurs.insertOne({
//   _id: 3,
//   user: "alex",
//   date: new Date().toString(),
//   title: "third title",
//   description: "welcome to our new channel",
// });


// const allDinosaurs = await dinosaurs.find({}).toArray();

// console.log(allDinosaurs);
// client.close();
