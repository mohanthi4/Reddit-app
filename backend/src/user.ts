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
    const user = userInfo.user;
    const id = userInfo._id;
    return { status: true, user, id };
  }

  async getUserName(Id) {
    const data = await this.#users.find({ _id: +Id }).toArray();
    return data[0].user;
  }
  async getAllUsers(Id) {
    const data = await this.#users.find({ _id: { "$ne": +Id } }).toArray();
    return data;
  }
  async userSubcribres(Id) {
    const data = await this.#users.find({ _id: +Id }).toArray();
    return data[0].subscribers;
  }

  async addSubscriber(Id, id) {
    await this.#users.updateOne(
      { _id: +Id },
      { $push: { subscribers: +id } },
    );

    const updatedUser = await this.#users.findOne({ _id: +Id });

    return updatedUser;
  }
}
