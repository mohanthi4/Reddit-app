import { MongoClient } from "mongodb";

interface PostsSchema {
  _id: number;
  user: string;
  date: string;
  title: string;
  description: string;
}

export const createClient = async () => {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  await client.connect();
  const db = client.db("readit");
  const postData = db.collection<PostsSchema>("users-posts");
  const length = await postData.find({}).toArray().then((data) => {
    if (data.length === 0) {
      return 1;
    }
    return data[data.length - 1]._id + 1;
  });
  return { postData, length };
};
