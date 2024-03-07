import { Router } from 'express';
import UserController from '../../controller/users.controller.js';
import { UserMiddleware } from '../../utils.js';

const router = Router();

/*router.get('/users', async (req, res, next) => {
    try {
      const users = await UserController.get();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  });*/

  router.get('/users', async (req, res, next) => {
    try {
      const users = await UserController.get();
      const selectedRoles = users.map(user => ({
        ...user,
        selectedAdmin: user.role === 'ADMIN' ? 'selected' : '',
        selectedPremium: user.role === 'PREMIUM' ? 'selected' : '',
        selectedUser: user.role === 'USER' ? 'selected' : ''
      }));
      res.render('users', { users: selectedRoles });
    } catch (error) {
      next(error);
    }
  });

  router.get('/users/mails', async (req, res, next) => {
    try {
      const email = "adminCoder@coder.com"
      const users = await UserController.findUserByEmail(email);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  });

  
  router.post('/users', async (req, res, next) => {
    try {
      const { body } = req;
      const users = await UserController.createUser(body);
      res.status(200).json(users);
    } catch (error) {
     next(error)
    }
  });

  
router.get("/users/:uid", async (req, res, next) => {
    try {
      const { params: { uid } } = req;
      const user = await UserController.getById(uid);
      res.status(200).json(user);
    } catch (error) {
      next(error)
    }
  });

  


  router.delete("/users/:uid", UserMiddleware('ADMIN'), async (req, res, next) => {
    try {
      const {
        params: { uid },
      } = req;
      await UserController.deleteById(uid);
      res.status(204).end();
    } catch (error) {
      next(error)
    }
  });

  router.put("/users/:uid",  async (req, res, next) => {
    try {
      const {
        params: { uid },
        body,
      } = req;
      console.log(body, "body");
      await UserController.updateRole(uid, body);
      res.status(204).end();
    } catch (error) {
      next(error)
    }
  });
  
  router.put("/user/:uid", async (req, res, next) => {
    try {
      const {
        params: { uid },
        body: { role }, // Extraer el valor del rol del cuerpo de la solicitud
      } = req;
      await UserController.updateRole(uid, role); // Pasar solo el valor del rol
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });


  export default router;