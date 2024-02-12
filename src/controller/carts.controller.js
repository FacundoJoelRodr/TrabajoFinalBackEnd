import CartService from '../service/cart.service.js';
import CartsManagerMongo from "../dao/cartsManagerMongo.js"
import { NotFoundException } from '../utils.js';

const cartService = new CartService();

export default class CartController {

  async get(req, res) {
    return await cartService.get();
  }

  async create(req, res, body) {
    return await cartService.create(body);
  }

  async getById(cid) {
    const cart = await cartService.getById(cid);
    const a = cart.products.map((product) => product.toJSON());
    const b = cart._id;
    return { products: a, cartId: b };
}

  async updateById(req, res, cid, body) {
    return await cartService.updateById(cid, body);
  }

  async deleteById(req, res, cid) {
    return await cartService.deleteProductsInCart(cid);
  }

  async deleteProduct(cid, pid, quantity) {
  
    return await cartService.deleteProduct(cid, pid, quantity);
  }


  async updateProduct(cid, pid, quantity) {
    const cart = await cartService.getById(cid);

    await cartService.updateById(cid, pid, quantity);

    return cart;
  }

  async generateTicket(cid) {
    const cart = await cartService.getById(cid);
    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }

    const userCart = await userModel.findOne({ carts: cart });
    console.log(userCart, 'use');
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

    const ticket = await ticketSchema.create(ticketData);
    const newCart = await cartService.create();

    for (const ticketProduct of ticketProducts) {
      const product = await ProductSchema.findById(ticketProduct.product);

      if (product) {
        let stock = (product.stock -= ticketProduct.quantity);

        if (stock < 0) {
          await cartService.updateById(
            newCart.id,
            ticketProduct.product,
            Math.abs(stock)
          );
          await userModel.findOneAndUpdate(
            { _id: userId },
            { cart: newCart.id },
            { new: true }
          );
          product.stock = 0;
        } else {
          product.stock = stock;
        }
        await cartService.deleteById(cid);
        await product.save();
      }
    }
    return ticket.id;
  }

  calculateTotalAmount(products) {
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
