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

  async addPosts(data) {
    data._id = this.#nextId++;
    await this.#posts.insertOne(data);
    return { status: "succes" };
  }
  async deletePosts(id) {
    await this.#posts.deleteOne({ id });
    return { status: "success" };
  }
}
