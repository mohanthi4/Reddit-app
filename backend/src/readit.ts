export default class Readit {
  #nextId;
  #posts;

  constructor(posts, nextId = 1) {
    this.#posts = posts;
    this.#nextId = nextId;
  }

  async getPosts() {
    // return { posts: this.#posts, nextId: this.#nextId };
    const data = await this.#posts.find({}).toArray();
    // console.log(data);
    return { posts: data, nextId: this.#nextId };
  }

  addPosts(data) {
    data.id = this.#nextId++;
    this.#posts.unshift(data);
    return { status: "succes" };
  }
  deletePosts(id) {
    console.log(this.#posts);
    const feedIndex = this.#posts.findIndex(
      (feed) => feed.id === id,
    );
    this.#posts.splice(feedIndex, 1);
    console.log(this.#posts);
    return { status: "success" };
  }
}
