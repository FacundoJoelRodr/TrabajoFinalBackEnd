import CartsManagerMongo from '../dao/cartsManagerMongo.js';
import { NotFoundException } from '../utils.js';
import ProductSchema from '../models/products.model.js';
import ticketController from '../controller/tickets.controller.js';
import UserController from '../controller/users.controller.js';

export default class cartService {
  static async get() {
    return await CartsManagerMongo.get();
  }

  static async create(body) {
    return await CartsManagerMongo.create(body);
  }

  static async getById(cid) {
    const cart = await CartsManagerMongo.getById(cid);
    return cart;
  }

  static async findOne() {
    const cart = await CartsManagerMongo.findOne();
    return cart;
  }

  static async updateById( cid, pid, quantity) {
    return await CartsManagerMongo.updateById(cid, pid, quantity);
  }

  static async deleteById( cid) {
    return await CartsManagerMongo.deleteProductsInCart(cid);
  }

  static async deleteProduct(cid, pid, quantity) {
    const cart = await CartsManagerMongo.getById(cid);

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    const cartDelete = await CartsManagerMongo.deleteProduct(
      cid,
      pid,
      quantity
    );
    return cartDelete;
  }

  static async updateProduct(cid, pid, quantity) {
    const cart = await CartsManagerMongo.getById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    await CartsManagerMongo.updateById(cid, pid, quantity);

    return cart;
  }

}
