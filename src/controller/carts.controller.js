import CartService from '../service/cart.service.js';
import UserController from './users.controller.js';
import ProductController from './products.controller.js';

export default class CartController {
  static async get() {
    try {
      return await CartService.get();
    } catch (error) {
      console.error('Error en obtener todos los carritos', error);
      throw new Error('Error al obtener los carritos');
    }
  }

  static async create(body) {
    try {
      return await CartService.create(body);
    } catch (error) {
      console.error('Error al crear carrito:', error);
      throw new Error('Error al crear el carrito');
    }
  }

  static async getById(cid) {
    try {
      const cart = await CartService.getById(cid);
      const a = cart.products.map((product) => product.toJSON());
      const b = cart._id;
      return { products: a, cartId: b };
    } catch (error) {
      console.error('Error al obtener carrito por id', error);
      throw new Error('Error al obtener el carrito por ID');
    }
  }

  static async updateById(cid, body) {
    try {
      return await CartService.updateById(cid, body);
    } catch (error) {
      console.error('Error al actualizar carrito por id:', error);
      throw new Error('Error al actualizar el carrito por ID');
    }
  }

  static async deleteById(cid) {
    try {
    
      return await CartService.deleteById(cid);
    } catch (error) {
      console.error('Error al borrar el carrito', error);
      throw new Error('Error al eliminar el carrito por ID');
    }
  }

  static async deleteProduct(cid, pid, quantity) {
    try {
      return await CartService.deleteProduct(cid, pid, quantity);
    } catch (error) {
      console.error('Error al borrar producto del carrito:', error);
      throw new Error('Error al eliminar el producto del carrito');
    }
  }

  static async updateProduct(cid, pid, quantity) {
    try {
      const product = await ProductController.getById(pid);
      const user = await UserController.getByCart(cid);
      if (product.owner === user._id) {
        throw new Error('no puedes comprar tu mismo producto');
      }
      const cart = await CartService.getById(cid);
      await CartService.updateProduct(cid, pid, quantity);
      return cart;
    } catch (error) {
      console.error('Error al actualizar producto en el carrito:', error);
      throw new Error('Error al actualizar el producto del carrito');
    }
  }
  static async findOne() {
    try {
      const cart = await CartService.findOne();
      return cart;
    } catch (error) {
      console.error('Error al encontrar un carrito:', error);
      throw new Error('Error al buscar un carrito');
    }
  }
}
