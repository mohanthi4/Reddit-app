export default class User {
  #nextId;
  #users;
  constructor(users, nextId = 1) {
    this.#users = users;
    this.#nextId = nextId;
  }

  async addUser(userInfo) {
    userInfo._id = this.#nextId++;
    await this.#users.insertOne(userInfo);
    const user = userInfo.user
    const id = userInfo._id
    return { status: true, user,id};
  }

  async getUserName(Id) {
    const data = await this.#users.find({ _id: +Id }).toArray();
    return data[0].user
  }
}