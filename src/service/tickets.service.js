import TicketsManager from "../dao/ticketsManagerMongo.js";
import CartController from "../controller/carts.controller.js";
import UserController from "../controller/users.controller.js";
import ProductController from "../controller/products.controller.js";

export default class ticketService {
  static async get() {
    return await TicketsManager.get();
  }

  static async create( body) {
    return await TicketsManager.create(body);
  }

  static async getById(tid) {
    const ticket = await TicketsManager.getById(tid);
    return ticket;
  }

  static async deleteById(tid) {
    const ticketDelete = await TicketsManager.deleteById(tid);

    return ticketDelete;
  }

  static async generateTicket(cid) {
    try {
      const cart = await CartController.getById(cid);
      if (!cart) {
        throw new NotFoundException('Carrito no encontrado');
      }
      const userCart = await UserController.getByCart(cart.cartId);
      const fechaActual = new Date();
      const fechaFormateada = fechaActual.toLocaleDateString('es-AR');
      const totalAmount = this.calculateTotalAmount(cart.products);

      const ticketData = {
        code: cid,
        purchase_datetime: fechaFormateada,
        amount: totalAmount,
        purchaser: userCart.email,
        carts: cart
      };

      const ticket = await TicketsManager.create(ticketData);
      const newCart = await CartController.create();
      for (const ticketProduct of cart.products) {
        const product = await ProductController.getById(ticketProduct.product);

        if (product) {
          let stock = (product.stock -= ticketProduct.quantity);

          if (stock < 0) {
            await CartController.updateById(
              newCart._id,
              ticketProduct.product,
              Math.abs(stock)
            );
            product.stock = 0;
          } else {
            product.stock = stock;
          }

          await product.save();
        }
      }

      await CartController.deleteById(cid);

      await UserController.getByCartAndUpdateCart(newCart._id, userCart._id);

      return ticket._id;
    } catch (error) {
      console.error('Error in generateTicket:', error);
      throw new Error('Error al generar el ticket');
    }
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
