import { Router } from 'express';
//import AuthMiddleware from '../../middleware/AuthMiddleware.js';
import CartController from '../../controller/carts.controller.js';
import ticketsModel from '../../models/tickets.model.js';
import CartsManagerMongo from "../../dao/cartsManagerMongo.js"
import mongoose from 'mongoose';
import { UserMiddleware } from '../../utils.js';

const router = Router();


//// MONGO

router.post('/carts', UserMiddleware('USER'), async (req, res, next) => {
  try {
    const { body } = req;
    await CartController.create(body);
    res.status(200).json(body);
  } catch (error) {
    next(next);
  }
});

router.get('/carts', UserMiddleware('USER'), async (req, res, next) => {
  try {
    await CartController.get();
    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

router.get('/carts/:cid', UserMiddleware('USER'), async (req, res, next) => {
  try {
    const {
      params: { cid },
    } = req;

    const cart = await CartController.getById(cid);
    res.render('carts', { products: cart.products, cartId: cart.cartId });
  } catch (error) {
    next(error);
  }
});

/////////////////////
router.put(
  '/carts/:cid/product/:pid',
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
      next(error)
    }
  }
);
///////////////////////////////
router.put('/carts/:cid', UserMiddleware('USER'), async (req, res, next) => {
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
});

router.delete(
  '/carts/:cid', UserMiddleware('USER'),
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
  '/carts/:cid/product/:pid', UserMiddleware('USER'),
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

      const cart = await CartController.deleteProduct(cid, pid);

      res.status(201).json(cart);
    } catch (error) {
      next(error);
    }
  }
);

/*router.post(
  '/carts/:cid/purchase', UserMiddleware('USER'),
  async (req, res, next) => {
    try {
      const { cid } = req.params;
      const ticket = await CartController.generateTicket(cid);
      res.status(200).json({ ticket });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/carts/:cid/purchase', UserMiddleware('USER'),
  async ( req, res, next) => {
    try {
      const {
        params: { cid },
      } = req;

      const cart = await CartController.generateTicket(cid);
      const ticket = await ticketsModel.findById(cart);

      const dataToSend = {
        code: ticket.code || 'No disponible',
        purchase_datetime: ticket.purchase_datetime || 'No disponible',
        purchaser: ticket.purchaser || 'No disponible',
        amount: ticket.amount || 'No disponible',
      };
      res.render('tickets', dataToSend);
    } catch (error) {
      next(error);
    }
  }
);*/

export default router;
