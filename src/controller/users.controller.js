import CartsManagerMongo from "../dao/cartsManagerMongo.js";
import userModel from "../models/user.model.js";
import userService from '../service/user.service.js';
import Exception from '../utils.js';

import { createHash } from "../utils.js";
export default class UserController {

  static async get(query = {}) {
    try {
      return await userService.getUsers(query);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async getById(uid) {
    try {
      return await userService.getUserById(uid);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async createUser(userData) {
    try {
      const user = await userService.createUser(userData);
      console.log('Usuario creado');
      return user.message;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async findUserByEmail(email) {
    try {
      return await userService.findUserByEmail({ email });
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async updateById(uid, data) {
    try {
      await userService.updateById(uid, data);
      console.log('Usuario actualizado');
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async updatePassword(uid, data) {
    try {
      await userService.updatePassword(uid, data);
      console.log('Usuario actualizado');
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async deleteById(uid) {
    try {
      await userService.deleteById(uid);
      console.log('Usuario eliminado');
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }


  async recoveryPassword(req, res) {
    const {
        body: { email, newPassword },
      } = req;
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(401).send("Email o contraseña incorrecto");
      }
    
      await userModel.updateOne(
        { email },
        { $set: { password: createHash(newPassword) } }
      );
    
  }

  async destroySession(y) {
    req.session.destroy((err) => {
        if (err) {
          console.log(err);
        }
      });
  }

 
}
