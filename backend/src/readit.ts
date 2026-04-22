export default class Readit {
  #nextId;
  #posts;

  constructor(posts = {}, nextId = 1) {
    this.#posts = [posts];
    this.#nextId = nextId;
  }

  getPosts() {
    return { feed: this.#posts, nextId: this.#nextId };
  }
}
