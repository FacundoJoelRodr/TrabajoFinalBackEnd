import userManager from '../dao/userManager.js';
import { Exception } from '../utils.js';
import userDto from '../dto/user.dto.js';

export default class userService {
  static async getUsers(query = {}) {
    const users = await userManager.get(query);
    return users.map((user) => new userDto(user));
  }

  static async getUserById(uid) {
    const user = await userManager.getById(uid);
    return new userDto(user);
  }

  static async getByEmail(email) {
    const user = await userManager.getByEmail(email);
    return user;
  }

  static async getByCart(cart) {
    const user = await userManager.getByCart(cart);
    return user;
  }

  static async getByCartAndUpdateCart(newCart, userId) {
    const user = await userManager.getByCartAndUpdateCart(newCart, userId);
    return user;
  }

  static async updateUserLastLogin(userId) {
    const user = await userManager.updateUserLastLogin(userId);
    return user;
  }

  static async getByDate(date) {
    const user = await userManager.getByDate(date);
    return user;
  }

  static async createUser(userData) {
    return await userManager.createUser(userData);
  }
  static async getUserByEmail(email) {
    const user = await userManager.getByEmail(email);
    if (!user) {
      throw new Exception('No existe el usuario', 404);
    }
    return user;
  }

  static async updateById(uid, data) {
    const user = await userManager.getById(uid);
    const criterio = { _id: uid };
    const operation = { $set: data };
    await userManager.updateById(criterio, operation);
  }

  static async updatePassword(uid, data) {
    // const user = await userManager.getById(uid);
    const criterio = { _id: uid };
    const operation = { $set: { password: data } };
    await userManager.updateById(criterio, operation);
  }

  static async updateRole(uid, newRole) {
    await userManager.updateRole(uid, newRole);
  }

  static async deleteById(uid) {
    const user = await userManager.getById(uid);
    if (!user) throw new Exception('El usuario no existe', 404);
    const criterio = { _id: uid };
    await userManager.deleteOne(criterio);
  }
}
