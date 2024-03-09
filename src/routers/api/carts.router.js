import { Router } from 'express';
import CartController from '../../controller/carts.controller.js';
import mongoose from 'mongoose';
import { UserMiddleware, jwtAuth} from '../../utils.js';

const router = Router();

//// MONGO

router.post('/carts', async (req, res, next) => {
  try {
    const { body } = req;
    await CartController.create(body);
    res.status(200).json(body);
  } catch (error) {
    next(next);
  }
});

router.get(
  '/carts',
  UserMiddleware(['USER', 'PREMIUM', 'ADMIN']),
  async (req, res, next) => {
    try {
      await CartController.get();
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/carts/:cid',
  UserMiddleware(['USER', 'PREMIUM', 'ADMIN']),
  async (req, res, next) => {
    try {
      const {
        params: { cid },
      } = req;

      const cart = await CartController.getById(cid);
      res.render('carts', { products: cart.products, cartId: cart.cartId });
    } catch (error) {
      next(error);
    }
  }
);

/////////////////////
router.put(
  '/carts/:cid/product/:pid',
  UserMiddleware(['USER', 'PREMIUM']),
  async (req, res, next) => {
    const {
      params: { cid, pid },
    } = req;

    const { quantity } = req.body;

    if (quantity === undefined) {
      return res
        .status(400)
        .json({ error: 'La cantidad no se proporcionó correctamente' });
    }

    try {
      const cart = await CartController.updateProduct(cid, pid, quantity);
      res.status(201).json(cart);
    } catch (error) {
      next(error);
    }
  }
);
///////////////////////////////
router.put(
  '/carts/:cid',
  UserMiddleware(['USER', 'PREMIUM']),
  async (req, res, next) => {
    try {
      const {
        params: { cid },
        body,
      } = req;
      await CartController.updateById(cid, body);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/carts/:cid',
  UserMiddleware(['USER', 'PREMIUM']),
  async (req, res, next) => {
    try {
      const {
        params: { cid },
      } = req;
      
      await CartController.deleteById(cid);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/carts/:cid/product/:pid',
  UserMiddleware(['USER', 'PREMIUM']),
  async (req, res, next) => {
    const {
      params: { cid, pid },
    } = req;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res
        .status(400)
        .json({ error: 'La cantidad no se proporcionó correctamente' });
    }

    try {
      if (!mongoose.isValidObjectId(cid) || !mongoose.isValidObjectId(pid)) {
        return res.status(400).json({ error: 'IDs inválidos' });
      }

      const cart = await CartController.deleteProduct(cid, pid, quantity);

      res.status(201).json(cart);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
