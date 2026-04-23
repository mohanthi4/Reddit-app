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

  async getPosts() {
    const data = await this.#posts.find({}).toArray();
    return { posts: data, nextId: this.#nextId };
  }

  async addPost(data: PostData) {
    data._id = this.#nextId++;
    await this.#posts.insertOne(data);
    return { status: "succes" };
  }
  async deletePost(_id: number) {
    await this.#posts.deleteOne({ _id });
    return { status: "success" };
  }
}
