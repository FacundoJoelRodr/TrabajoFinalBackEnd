import userService from '../service/user.service.js';
import emailService from '../service/email.service.js';
import { Exception } from '../utils.js';
import UserDto from '../dto/user.dto.js';

export default class UserController {

  static async deleteInactiveUsers() {
    const ultimaConexion48hs = new Date();
    ultimaConexion48hs.setHours(ultimaConexion48hs.getHours() - 48);
    try {
      // Buscar usuarios que no se hayan conectado en las últimas 24 horas
      const inactiveUsers = await userService.getByDate(ultimaConexion48hs);

      // Eliminar los usuarios inactivos
      for (const user of inactiveUsers) {
        await emailService.sendAlertDeleteUser(user);
        await userService.deleteById(user._id);
        console.log(`Usuario ${user.email} eliminado debido a inactividad`);
      }
    } catch (error) {
      console.error('Error al eliminar usuarios inactivos:', error);
    }
  }

  static async getByDate(date) {
    try {
      const user = userService.getByDate(date);
      return user;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

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
      const { email } = userData; // Asegúrate de que el email esté presente en los datos de usuario

      const userMail = await userService.getByEmail(email);
      if (userMail) {
        throw new Error('User already registered'); // Lanza una excepción si el usuario ya está registrado
      }

      const user = await userService.createUser(userData);

      await emailService.sendWelcomeEmail(user);

      return user;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async getByEmail(email) {
    try {
      const user = await userService.getByEmail(email);
      if (!user) {
        throw new Exception('No existe el usuario', 404);
      }
      return user;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async getByCart(cart) {
    try {
      const user = await userService.getByCart(cart);
      if (!user) {
        throw new Exception('No existe el usuario', 404);
      }

      return user;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async getByCartAndUpdateCart(newCart, userId) {
    const user = await userService.getByCartAndUpdateCart(newCart, userId);
    return user;
  }

  static async updateUserLastLogin(userId) {
    const user = await userService.updateUserLastLogin(userId);
    return user;
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
      body: { email, oldPassword, newPassword },
    } = req;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).send('Email o contraseña incorrecto');
    }

    const isPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('La contraseña antigua es incorrecta');
    }

    if (oldPassword === newPassword) {
      return res
        .status(401)
        .send('La nueva contraseña no puede ser igual a la anterior');
    }


    // Actualiza la contraseña
    await userModel.updateOne(
      { email },
      { $set: { password: createHash(newPassword) } }
    );

    res.send('Contraseña actualizada con éxito');
  }

  static async updateRole(uid, newRole) {
    await userService.updateRole(uid, newRole);
  }


  async destroySession() {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
    });
  }
}
