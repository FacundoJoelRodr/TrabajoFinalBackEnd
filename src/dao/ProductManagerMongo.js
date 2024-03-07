import productSchema from '../models/products.model.js';
import { Exception, NotFoundException, BadRequestException } from '../utils.js';

export default class ProductManager {
  static async validateRequiredFields(data) {
    const { title, code, price, stock, description, category, owner } = data;
    if (!title || !code || !price || !stock || !description || !category || !owner) {
      throw new BadRequestException('Faltan campos obligatorios');
    }
  }

  ///OBTENER TODOS LOS PRODUCTOS
  static get(query = {}) {
    const criteria = {};
    if (query.course) {
      criteria.course = query.course;
      return productSchema.find(criteria);
    } else {
      throw new NotFoundException('Not Found');
    }
  }

  static async paginate(criteria, opts) {
    const paginate = await productSchema.paginate(criteria, opts);
    return paginate;
  }

  //CREAR PRODUCTO
  static async create(body) {
    const product = await productSchema.create(body);
      return product;
    
  }

  ///OBTENER PRODUCTO POR ID
  static async  getById(pid) {
    const product =  await productSchema.findById(pid);
    return product;
  }

  ///ACTUALIZA EL PRODUCTO POR ID
  static async updateById(pid, data) {
    const product = await productSchema.findById(pid);
    if (!product) {
      throw new NotFoundException('Not Found');
    }
    const criteria = { _id: pid };
    const operation = { $set: data };

    return await productSchema.updateOne(criteria, operation);
  }

  ///BORRRA EL PRODUCTO POR ID

  static async deleteById(pid) {
   
    const product = await productSchema.findById(pid);
    if (!product) {
      throw new NotFoundException('Not Found');
    }
    const criteria = { _id: pid };
    await productSchema.deleteOne(criteria);

    console.log('Producto se ha eliminado correctamente');
  }
}
