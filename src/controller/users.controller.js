import CartsManagerMongo from "../dao/cartsManagerMongo.js";
import userModel from "../models/user.model.js";
import { createHash } from "../utils.js";
export default class UserController {


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
