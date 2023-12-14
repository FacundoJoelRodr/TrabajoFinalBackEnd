import productsModel from "../models/products.model.js"
import ProductManager from "../dao/ProductManagerMongo.js";

const buildResponse = (data) => {
  return {
    status: "success",
    payload: data.docs.map((product) => product.toJSON()),
    totalPages: data.totalPages,
    prevPage: data.prevPage,
    nextPage: data.nextPage,
    page: data.page,
    hasPrevPage: data.hasPrevPage,
    hasNextPage: data.nextPage,
    prevLink: data.hasPrevPage
    ? `http://localhost:8080/api/products?limit=${data.limit}&page=${data.prevPage}${data.category ? `&category=${data.category}` : ''}${data.sort ? `&sort=${data.sort}` : ''}`
    : "",
    nextLink: data.hasNextPage
    ? `http://localhost:8080/api/products?limit=${data.limit}&page=${data.nextPage}${data.category ? `&category=${data.category}` : ''}${data.sort ? `&sort=${data.sort}` : ''}`
    : ''
  };
};


export default class ProductController{


    async get (req, res){

      if(!req.session.user){
        return res.redirect('/api/login')
    }
        const { first_name, last_name, email, role } = req.session.user;

        const { page = 1, limit = 10, category, sort } = req.query;
        const opts = { page, limit };
        if (sort) {
            opts.sort = { price: sort === 'asc' ? 1 : sort === 'desc' ? -1 : 1 };
        }
        const criteria = {};
        if (category) {
            criteria.category = category;
        }
        const products = await productsModel.paginate(criteria, opts);
        const build = buildResponse({ ...products, category });
        const user = req.session.user;
        const dataForRendering = { ...build, user };
        return dataForRendering;

    }


    async create (body,req, res){
      if(!req.session.user){
        return res.redirect('/api/login')
    }
      const product = await ProductManager.create(body);
      return product
    }


    async getById (pid){

      if(!req.session.user){
        return res.redirect('/api/login')
    }

    const product = await ProductManager.getById(pid);
        return product
    }


    async updateById (req,res, pid, body){

      if(!req.session.user){
        return res.redirect('/api/login')
    }
      await ProductManager.updateById(pid, body);
    }

    async deleteById (req, res, pid){

      if(!req.session.user){
        return res.redirect('/api/login')
    }

      await ProductManager.deleteById(pid);
        
    }

}