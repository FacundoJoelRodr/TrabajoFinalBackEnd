import userModel from "../models/user.model.js";
import { Exception } from "../utils.js";

export default class userManager {
  static get() {
    try {
      const users = userModel.find();
      return users;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static getById(uid) {
    try {
      const user = userModel.findById(uid);
      return user;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static getByEmail(email) {
    try {
      const user = userModel.findOne({ email });
      console.log(user, "usermail");
      return user;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
  static getByCartAndUpdateCart(newCart, userId) {
    const updatedUser =  userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { carts: newCart } },
      { new: true }
    );
    return updatedUser;
  }
  static getByCart(cart) {
    try {
      const user = userModel.findOne({ carts: cart }); // Debes pasar { cart: cart } como filtro
      return user;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static createUser(userData) {
    try {
      const user = userModel.create(userData);
      console.log("Usuario creado");
      return user;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static getByEmail(email) {
    try {
      const user = userModel.findOne({ email });
      return user;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static updateById(uid, data) {
    try {
      userSchema.updateOne({ _id: uid }, data);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static deleteOne(uid) {
    try {
      const result = userSchema.deleteOne({ _id: uid });
      return result;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
}
