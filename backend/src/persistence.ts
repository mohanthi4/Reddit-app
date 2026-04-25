import { MongoClient } from "mongodb";

interface PostsSchema {
  _id: number;
  userId: number;
  date: string;
  title: string;
  description: string;
  likes: number;
  likedUsers: number[];
}

interface UsersSchema {
  _id: number;
  user: string;
  password: string | number;
  subscribers: number[];
}

export const createClient = async () => {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  await client.connect();
  const db = client.db("readit");
  const postData = db.collection<PostsSchema>("feed-data");
  const userData = db.collection<UsersSchema>("users-data");
  // await postData.deleteOne({ _id: 6 });
  const lastPost = await postData
    .find({})
    .sort({ _id: -1 })
    .limit(1)
    .toArray();

  const postLength = lastPost.length === 0 ? 1 : lastPost[0]._id + 1;

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
