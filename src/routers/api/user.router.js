import { Router } from 'express';
import UserController from '../../controller/users.controller.js';

import { UserMiddleware } from '../../utils.js';

const router = Router();

router.get('/users', async (req, res, next) => {
    try {
      const users = await UserController.get();
      res.status(200).json(users);
    } catch (error) {
      next(error);
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
      await UserController.updateById(uid, body);
      res.status(204).end();
    } catch (error) {
      next(error)
    }
  });



  export default router;