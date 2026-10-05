export type PostData = {
  _id?: number;
  user: string;
  date: string;
  title: string | undefined;
  description: string | undefined;
};

export default class Reddit {
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
    await this.#posts.findOneAndDelete({ _id: id });
    const content = await this.#posts.find().toArray();
    return content;
  }

  async getAllPosts(from: number, to: number) {
    const data = await this.#posts.find().sort({ _id: -1 }).skip(from).limit(
      to + 1,
    ).toArray();
    const hasNextPage = data.length > to;
    const posts = hasNextPage ? data.slice(0, to) : data;
    const nextCursor = hasNextPage ? from + to : null;
    return { posts, nextCursor };
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
