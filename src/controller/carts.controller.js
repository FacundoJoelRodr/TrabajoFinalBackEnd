import CartsManagerMongo from "../dao/cartsManagerMongo.js";
import cartsModel from "../models/carts.model.js";
import ProductSchema from "../models/products.model.js"
import ProductManager from "../dao/ProductManagerMongo.js"
import {NotFoundException} from "../utils.js"
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


  async purchaseCart(cid) {
    const cart = await cartsModel.findById(cid);
  
    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }
  
    const newCart = await cartsModel.create({ products: [] });
    console.log('Inicio del proceso de compra');

    for (const cartProduct of cart.products) {
      const { product: productId, quantity } = cartProduct;
    
    
      console.log(`Procesando producto: ${productId}`);

      const product = await ProductSchema.findById(productId);
      console.log(product, "product");
      if (!product) {
        console.log(`Producto no encontrado: ${productId}`);
        continue;
      }
    
      if (product.stock < quantity) {

        await CartsManagerMongo.updateById(newCart.id, productId, quantity);
      } else {
        product.stock -= quantity;
       await ProductManager.updateById(product.id, product);
    
      }
      console.log(`Producto ${productId} procesado exitosamente`);
    }
    console.log('Fin del proceso de compra');
    const newCartProductIds = newCart.products.map((product) => product.product);
    console.log(newCartProductIds, "newCartProductIds");
    // Filtra los productos del carrito original que se transfieren al nuevo carrito
    cart.products = cart.products.filter((cartProduct) => !newCartProductIds.includes(cartProduct.product));
     console.log(cart.products, "cart.products");
    await newCart.save();
    await cart.save();
    
    return { message: 'Compra completada con éxito' };
  }
}
