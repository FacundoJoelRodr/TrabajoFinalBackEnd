import productSchema from '../models/products.model.js';
import { Exception, NotFoundException } from '../utils.js';

export default class ProductManager {
  static async validateRequiredFields(data) {
    const { title, code, price, stock, description, category } = data;
    if (!title || !code || !price || !stock || !description || !category) {
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

  //CREAR PRODUCTO
  static async create(data) {
    const products = await productSchema.find();

    await this.validateRequiredFields(data);

    const product = await productSchema.create(data);

    if (products.some((p) => p.code === code)) {
      throw new BadRequestException(
        'Este producto ya se encuentra en la base de datos'
      );
    } else {
      console.log('Producto creado correctamente');
      return product;
    }
  }

  ///OBTENER PRODUCTO POR ID
  static async getById(pid) {
    const product = await productSchema.findById(pid);
    if (!product) {
      throw new NotFoundException('Not Found');
    }
    return product;
  }

  ///ACTUALIZA EL PRODUCTO POR ID
  static async updateById(pid, data) {
    await this.validateRequiredFields(data);

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
