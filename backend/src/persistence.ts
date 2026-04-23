import { MongoClient } from "mongodb";

interface PostsSchema {
  _id: number;
  user: string;
  date: string;
  title: string;
  description: string;
}

interface UsersSchema {
  _id: number;
  user: string;
  password: string | number;
}

export const createClient = async () => {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  await client.connect();
  const db = client.db("readit");
  const userData = db.collection<PostsSchema>("users-info");
  const postData = db.collection<UsersSchema>("users-posts");
  const postLength = await postData.find({}).toArray().then((data) => {
    if (data.length === 0) {
      return 1;
    }
    return data[data.length - 1]._id + 1;
  });
  const userLength = await userData.find({}).toArray().then((data) => {
    if (data.length === 0) {
      return 1;
    }
    return data[data.length - 1]._id + 1;
  });

  return {
    postInfo: { postData, length: postLength },
    userInfo: { userData, length: userLength },
  };
};
