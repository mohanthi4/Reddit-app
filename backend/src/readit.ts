export type PostData = {
  _id?: number;
  user: string;
  date: string;
  title: string | undefined;
  description: string | undefined;
};

export default class Readit {
  #nextId;
  #posts;
  constructor(posts, nextId = 1) {
    this.#posts = posts;
    this.#nextId = nextId;
  }

  async addPost(data: PostData) {
    data._id = this.#nextId++;
    await this.#posts.insertOne(data);
    return { status: "success" };
  }
  async deletePost(_id: number) {
    await this.#posts.deleteOne({ _id });
    return { status: "success" };
  }

  async getAllPosts(Ids) {
    const data = await this.#posts.find({ userId: { $in: [...Ids] } })
      .toArray();
    return { posts: data, nextId: this.#nextId };
  }

  async addLike(Uid, id) {
    const beforeUser = await this.#posts.findOne({ _id: id });
    console.log("---> before", beforeUser);
    await this.#posts.updateOne(
      { _id: id },
      {
        $push: { likedUsers: Uid },
        $inc: { likes: 1 },
      },
    );
    const updatedUser = await this.#posts.findOne({ _id: id });
    console.log("---> after", updatedUser);
    return updatedUser;
  }
}
