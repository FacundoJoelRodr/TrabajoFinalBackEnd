import CartsManagerMongo from '../dao/cartsManagerMongo.js';
import { NotFoundException } from '../utils.js';
import ProductSchema from '../models/products.model.js';
import ticketController from "../controller/tickets.controller.js"
import userModel from '../models/user.model.js';

export default class cartService {
    static async get(req, res) {
        return await CartsManagerMongo.get();
      }
    
      static  async create(req, res, body) {
        return await CartsManagerMongo.create(body);
      }
    
      static async getById(cid) {
    
      const cart = await CartsManagerMongo.getById(cid);
      return cart;
    }
    
    static  async updateById(req, res, cid, pid, quantity) {
        return await CartsManagerMongo.updateById( cid,pid, quantity);
      }
    
      static  async deleteById(req, res, cid) {
        return await CartsManagerMongo.deleteProductsInCart(cid);
      }
    
      static   async deleteProduct(cid, pid, quantity) {
        const cart = await CartsManagerMongo.getById(cid);
    
        if (!cart) {
          return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        const cartDelete = await CartsManagerMongo.deleteProduct(cid, pid, quantity);
        return cartDelete
      }
    
    
      static  async updateProduct(cid, pid, quantity) {
        const cart = await CartsManagerMongo.getById(cid);
    
        if (!cart) {
          return res.status(404).json({ error: 'Carrito no encontrado' });
        }
    
        await CartsManagerMongo.updateById(cid, pid, quantity);
    
        return cart;
      }
    
      static  async generateTicket(cid) {
        const cart = await CartsManagerMongo.getById(cid);
        if (!cart) {
          throw new NotFoundException('Carrito no encontrado');
        }
    
        const userCart = await userModel.findOne({ carts: cart });
        const fechaActual = new Date();
        const fechaFormateada = fechaActual.toLocaleDateString('es-AR');
    
        const ticketProducts = cart.products;
        const totalAmount = this.calculateTotalAmount(ticketProducts);
    
        const ticketData = {
          code: cid,
          purchase_datetime: fechaFormateada,
          amount: totalAmount,
          purchaser: userCart.email,
        };
    
        const ticket = await ticketController.create(ticketData);
        const newCart = await CartsManagerMongo.create();
        console.log(ticket, "ticket ");
        for (const ticketProduct of ticketProducts) {
          const product = await ProductSchema.findById(ticketProduct.product);
          
          if (product) {
            let stock = (product.stock -= ticketProduct.quantity);
    
            if (stock < 0) {
            await CartsManagerMongo.updateById(
                newCart._id,
                ticketProduct.product,
                Math.abs(stock)
              );

              product.stock = 0;
            } else {
              product.stock = stock;
            }
            await CartsManagerMongo.deleteById(cid);
            await product.save();
          }
        }

        await userModel.findOneAndUpdate(
          { _id: userCart._id },
          { carts: newCart._id },
          { new: true }
        );

        return ticket.id;
      }
    
      static calculateTotalAmount(products) {
        return products
          .reduce((total, product) => {
            const quantity = Number(product.quantity);
            const price = Number(product.product.price);
            if (!isNaN(quantity) && !isNaN(price)) {
              return total + quantity * price;
            } else {
              return total;
            }
          }, 0)
          .toFixed(2);
      }
}