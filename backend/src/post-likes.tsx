export default class PostLikes {
  #nextId;
  #postLikes;
  constructor(postLikes, nextId = 1) {
    this.#postLikes = postLikes;
    this.#nextId = nextId;
  }
}
