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
  // const postLikes = db.collection<PostLikes>("post-likes");
  // const body1 = { _id: 1, user: "John", password: "123", subscribers: [2, 4] };
  // const body2 = { _id: 2, user: "Alex", password: "123", subscribers: [1, 3] };
  // const data1 = {
  //   _id: 1,
  //   userId: 1,
  //   user: "John",
  //   date: "23/12/2024",
  //   description: "1 desc",
  //   title: "1",
  //   likes: 2,
  //   likedUsers: [1, 3],
  // };
  // const data2 = {
  //   _id: 2,
  //   userId: 1,
  //   user: "John",
  //   date: "23/11/2024",
  //   description: "2 desc",
  //   title: "2",
  //   likes: 3,
  //   likedUsers: [4, 2, 3],
  // };
  // const data3 = {
  //   _id: 3,
  //   userId: 2,
  //   user: "Alex",
  //   date: "23/10/2024",
  //   description: "3 desc",
  //   title: "3",
  //   likes: 2,
  //   likedUsers: [1, 3],
  // };
  // await postData.insertOne(data1);
  // await postData.insertOne(data2);
  // await postData.insertOne(data3);
  // await userData.insertOne(body1);
  // await userData.insertOne(body2);
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
