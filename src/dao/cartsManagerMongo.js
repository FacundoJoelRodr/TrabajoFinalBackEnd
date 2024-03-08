import { Exception, NotFoundException } from '../utils.js';
import CartSchema from '../models/carts.model.js';

export default class CartsManager {
  // OBTENER TODOS LOS CARRITOS
  static get(query = {}) {
    const criteria = {};
    if (!criteria) {
      throw new NotFoundException('Not Found');
    }
    return CartSchema.find(criteria).populate('products.product');
  }

  // CREAR CARRITO
  static create(data) {
    const newCart = CartSchema.create(data);
    if (!newCart) {
      throw new NotFoundException('Not Found');
    }

    return newCart;
  }

  static async findOne() {
    const cart = await CartSchema.findOne();
    return cart;
  }

  // OBTENER CARRITO POR ID
  static async getById(cid) {
    const cart = await CartSchema.findById(cid).populate('products.product');
    if (!cart) {
      throw new NotFoundException('Not Found');
    }
    return cart;
  }
  // ACTUALIZAR CARRITO POR ID
  static async updateById(cid, pid, quantity) {
    const cart = await CartSchema.findById(cid);

    if (!cart) {
      throw new NotFoundException('Not Found');
    }

    let product = cart.products.find((p) => String(p.product) === pid);

    if (!product) {
      product = { product: pid, quantity: quantity };
      cart.products.push(product);
    }

    product.quantity += quantity;

    await cart.save();
  }

  // ELIMINAR CARRITO POR ID
  static async deleteById(cid) {
    const cart = await CartSchema.findById(cid);

    if (!cart) {
      throw new NotFoundException('Not Found');
    }
    const criteria = { _id: cid };

    return await CartSchema.deleteOne(criteria);
  }

  static async deleteProduct(cid, pid, quantity) {
    try {
        const cart = await CartSchema.findById(cid);
     
        if (!cart) {
            throw new NotFoundException('Carrito no encontrado');
        }

        const productIndex = cart.products.findIndex(p => String(p.product) === pid);
        
        if (productIndex === -1) {
            throw new NotFoundException('Producto no encontrado en el carrito');
        }

        if (cart.products[productIndex].quantity <= quantity) {
            // Si la cantidad a eliminar es mayor o igual a la cantidad del producto en el carrito, eliminar el producto completamente
            cart.products.splice(productIndex, 1);
        } else {
            // Si la cantidad a eliminar es menor que la cantidad del producto en el carrito, reducir la cantidad del producto
            cart.products[productIndex].quantity -= quantity;
        }

        // Guardar los cambios en el carrito
        return await cart.save();
    } catch (error) {
        console.error('Error al borrar producto del carrito:', error);
        throw new Error('Error al eliminar el producto del carrito');
    }
}

  static async deleteProductsInCart(cid) {
    const cart = await CartSchema.findOneAndUpdate(
      { _id: cid },
      { $set: { products: [] } },
      { new: true }
    );
  
    if (!cart) {
      throw new NotFoundException('Not Found');
    }

    return cart;
  }
}
