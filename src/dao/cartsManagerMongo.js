
import { Exception, NotFoundException } from '../utils.js';
import CartSchema from "../models/carts.model.js";


export default class CartsManager {
  // OBTENER TODOS LOS CARRITOS
  static get(query = {}) {
    const criteria = {};
   if(!criteria){
    throw new NotFoundException('Not Found');
   }
    return CartSchema.find(criteria).populate('products.product')
  }

  // CREAR CARRITO
  static async create(data) {

      const newCart = await CartSchema.create(data); 
      if(!newCart){
        throw new NotFoundException('Not Found');
      }
 
      return newCart;

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

  
  const cart = await CartSchema.findById(cid);
  
  if (!cart) {
    throw new NotFoundException('Not Found');
  }


  const product = cart.products.find((p) => String(p._id) === pid);

  if (!product) {
    cart.products.push({ _id: pid, quantity });
  } else {    
    product.quantity -= quantity; 
  }

  return await cart.save(); 

}

static async deleteProductsInCart(cid) {
  const cart = await CartSchema.findOneAndUpdate({ _id: cid }, { $set: { products: [] } }, { new: true });

  if (!cart) {
    throw new NotFoundException('Not Found');
  }

  return cart
}

}