
import { Router } from "express";

import CartController from "../../controller/carts.controller.js";
import mongoose from "mongoose";

const router = Router();

const cartController = new CartController();
//// MONGO

router.post("/carts/:cid/purchase", async (req, res, next) => {
    try {
      const { cid } = req.params;
      const userCart = await userModel.findOne({ carts: cart });
  
      const ticket = await cartController.generateTicket(cid,userCart);
      console.log(userCart,"usercartrouter");
      res.status(200).json({ ticket });
    } catch (error) {
      next(error) 
    }
  });
  
  router.get('/carts/:cid/purchase', async (req, res, next) => {
    try {
      const { params: { cid } } = req;
      const cart = await cartController.generateTicket(cid);

      const ticket = await ticketsModel.findById(cart);
      res.render('tickets', { 
        code: ticket.code || 'No disponible',
        purchase_datetime: ticket.purchase_datetime || 'No disponible',
        purchaser: ticket.purchaser || 'No disponible',
        amount: ticket.amount || 'No disponible'
      });
    } catch (error) {
      next(error);
    }
  });
  export default router;