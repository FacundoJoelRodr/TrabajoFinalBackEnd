import CartsManagerMongo from "../dao/cartsManagerMongo.js";
import { NotFoundException } from "../utils.js";
import ProductSchema from "../models/products.model.js";
import ticketSchema from "../models/tickets.model.js";
export default class CartController {
  async get(req, res) {
    return await CartsManagerMongo.get();
  }

  async create(req, res, body) {
    return await CartsManagerMongo.create(body);
  }

  async getById(cid) {
    const cart = await CartsManagerMongo.getById(cid);
    const a = cart.products.map((product) => product.toJSON());
    const b = cart._id;
    return { products: a, cartId: b };
  }

  async updateById(req, res, cid, body) {
    return await CartsManagerMongo.updateById(cid, body);
  }

  async deleteById(req, res, cid) {
    return await CartsManagerMongo.deleteProductsInCart(cid);
  }

  async deleteProduct(cid, pid, quantity) {
    const cart = await CartsManagerMongo.getById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    return await CartsManagerMongo.deleteProduct(cid, pid, quantity);
  }

  async deleteProduct(cid, pid, quantity) {
    const cart = await CartsManagerMongo.getById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    await CartsManagerMongo.deleteProduct(cid, pid, quantity);
    return cart;
  }

  async updateProduct(cid, pid, quantity) {
    const cart = await CartsManagerMongo.getById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    await CartsManagerMongo.updateById(cid, pid, quantity);

    return cart;
  }

  async generateTicket(cid, req) {
    const cart = await CartsManagerMongo.getById(cid);
    if (!cart) {
      throw new NotFoundException("Carrito no encontrado");
    }

    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleDateString('es-AR');
  
    const ticketProducts = cart.products;
    const totalAmount = this.calculateTotalAmount(ticketProducts);

    const ticketData = {
      code: cid,
      purchase_datetime: fechaFormateada,
      amount: totalAmount,
      purchaser: req.user.email,
    };

    const ticket = await ticketSchema.create(ticketData);
    const newCart = await CartsManagerMongo.create();

    for (const ticketProduct of ticketProducts) {
      const product = await ProductSchema.findById(ticketProduct.product);

      if (product) {
        let stock = (product.stock -= ticketProduct.quantity);

        if (stock < 0) {
          await CartsManagerMongo.updateById(
            newCart.id,
            ticketProduct.product,
            Math.abs(stock)
          );
          product.stock = 0;
        } else {
          product.stock = stock;
        }
        await cartController.deleteById(cid)
        await product.save(); // Guarda los cambios en el producto
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
