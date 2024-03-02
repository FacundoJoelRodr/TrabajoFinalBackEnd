import productManagerMongo from '../dao/ProductManagerMongo.js';

export default class productService {
  static async get() {
    return await productManagerMongo.get();
  }

  static async create(data) {
    return await productManagerMongo.create(data);
  }

  static async paginate(criteria, opts) {
    const paginate = await productManagerMongo.paginate(criteria, opts);
    return paginate;
  }

  static async getById(pid) {
    const product = await productManagerMongo.getById(pid);
    return product;
  }

  static async updateById(pid, data) {
    return await productManagerMongo.updateById(pid, data);
  }

  static async deleteById(pid) {
    return await productManagerMongo.deleteById(pid);
  }
}