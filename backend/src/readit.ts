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

  async getPosts(Id) {
    const data = await this.#posts.find({ userId: +Id }).toArray();
    return { posts: data, nextId: this.#nextId };
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
    console.log(data, "posts in get");
    return { posts: data, nextId: this.#nextId };
  }
}
