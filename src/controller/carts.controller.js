import CartService from '../service/cart.service.js';

export default class CartController {

  static async get(req, res) {
    return await CartService.get();
  }

  static async create(req, res, body) {
    return await CartService.create(body);
  }

  static async getById(cid) {
    const cart = await CartService.getById(cid);
    const a = cart.products.map((product) => product.toJSON());
    const b = cart._id;
    return { products: a, cartId: b };
}

static async updateById(req, res, cid, body  ) {
    return await CartService.updateById(cid, body);
  }

  static async deleteById(req, res, cid) {
    return await CartService.deleteProductsInCart(cid);
  }

  static async deleteProduct(cid, pid, quantity) {
  
    return await CartService.deleteProduct(cid, pid, quantity);
  }


  static async updateProduct(cid, pid, quantity) {
    const cart = await CartService.getById(cid);

    await CartService.updateProduct(cid, pid, quantity);
    return cart;
  }

  static async generateTicket(cid) {
    return await CartService.generateTicket(cid);
    
  }

}
