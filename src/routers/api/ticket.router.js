
import { Router } from "express";
import TicketsController from "../../controller/tickets.controller.js"

const router = Router();

//// MONGO

router.post("/carts/:cid/purchase", async (req, res, next) => {
    try {
      const { cid } = req.params;
    
      const ticket = await TicketsController.generateTicket(cid);

      res.status(200).json({ ticket });
    } catch (error) {
      next(error) 
    }
  });
  
  router.get('/carts/:cid/purchase', async (req, res, next) => {
    try {
      const { params: { cid } } = req;
      const cart = await TicketsController.generateTicket(cid);

      const ticket = await TicketsController.getById(cart._id);
     
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