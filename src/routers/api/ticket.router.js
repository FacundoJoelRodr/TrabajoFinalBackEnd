
import { Router } from "express";

import CartController from "../../controller/carts.controller.js";

import TicketsController from "../../controller/tickets.controller.js"
import ticketsModel from "../../models/tickets.model.js";
const router = Router();

//// MONGO

router.post("/carts/:cid/purchase", async (req, res, next) => {
    try {
      const { cid } = req.params;
      const userCart = await userModel.findOne({ carts: cart });
  
      const ticket = await CartController.generateTicket(cid,userCart);

      res.status(200).json({ ticket });
    } catch (error) {
      next(error) 
    }
  });
  
  router.get('/carts/:cid/purchase', async (req, res, next) => {
    try {
      const { params: { cid } } = req;
      const cart = await CartController.generateTicket(cid);

      const ticket = await TicketsController.getById(cart);
     
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