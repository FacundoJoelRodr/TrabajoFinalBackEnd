import userModel from '../models/user.model.js';

export default class userManager {
  static get() {
    const users = userModel.find();
    return users;
  }

  static getById(uid) {
    const user = userModel.findById(uid);
    return user;
  }

  static getByEmail(email) {
    const user = userModel.findOne({ email });
    return user;
  }
  static getByCartAndUpdateCart(newCart, userId) {
    const updatedUser = userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { carts: newCart } },
      { new: true }
    );
    return updatedUser;
  }

  static updateUserLastLogin(userId) {
    const updatedUser = userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { lastLogin: new Date() } },
      { new: true }
    );
    return updatedUser;
  }

  static getByCart(cart) {
    const user = userModel.findOne({ carts: cart });
    return user;
  }

  static getByDate(date) {
    const user = userModel.find({ lastLogin: { $lt: date } });
    return user;
  }

  static createUser(userData) {
    const user = userModel.create(userData);
    return user;
  }

  static getByEmail(email) {
    const user = userModel.findOne({ email });
    return user;
  }

  static updateById(uid, data) {
    userModel.updateOne({ _id: uid }, data);
  }

  static deleteOne(uid) {
    const result = userModel.deleteOne({ _id: uid });
    return result;
  }

  static async updateRole(uid, newRole) {
    const user = await userModel.findOneAndUpdate(
      { _id: uid },
      { $set: { role: newRole } },
      { new: true }
    );
    console.log(user, "user role dao");
    return user;
  }
}
