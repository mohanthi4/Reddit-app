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
    const content = await this.#posts.find().toArray();
    return content;
  }
  async deletePost(id: number) {
    const data = await this.#posts.findOneAndDelete({ _id: id });
    return data._id;
  }

  async getAllPosts(Ids) {
    const data = await this.#posts.find({ userId: { $in: [...Ids] } })
      .toArray();
    return { posts: data, nextId: this.#nextId };
  }

  async addLike(Uid, id) {
    await this.#posts.updateOne(
      { _id: id },
      {
        $push: { likedUsers: Uid },
        $inc: { likes: 1 },
      },
    );
    const updatedUser = await this.#posts.findOne({ _id: id });
    return updatedUser;
  }

  async unLike(Uid, id) {
    await this.#posts.updateOne(
      { _id: id },
      {
        $pull: { likedUsers: Uid },
        $inc: { likes: -1 },
      },
    );
    const updatedUser = await this.#posts.findOne({ _id: id });
    return updatedUser;
  }
}
