import productService from "../service/products.service.js";
import UserController from "../controller/users.controller.js";
import { JWT_SECRET, verificarToken } from "../utils.js";

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
      ? `http://localhost:8080/api/products?limit=${data.limit}&page=${
          data.prevPage
        }${data.category ? `&category=${data.category}` : ""}${
          data.sort ? `&sort=${data.sort}` : ""
        }`
      : "",
    nextLink: data.hasNextPage
      ? `http://localhost:8080/api/products?limit=${data.limit}&page=${
          data.nextPage
        }${data.category ? `&category=${data.category}` : ""}${
          data.sort ? `&sort=${data.sort}` : ""
        }`
      : "",
  };
};

export default class ProductController {
  async get(req, res) {
    const { page = 1, limit = 10, category, sort } = req.query;
    const opts = { page, limit };
    if (sort) {
      opts.sort = { price: sort === "asc" ? 1 : sort === "desc" ? -1 : 1 };
    }
    const criteria = {};
    if (category) {
      criteria.category = category;
    }

    const products = await productService.paginate(criteria, opts);
    const build = buildResponse({ ...products, category });
    const user = req.session.user;
    try {
      const decodedToken = verificarToken(user, JWT_SECRET);
      const newuser = await UserController.getById(decodedToken.id);
      const cartId = newuser.carts;
      const dataForRendering = { ...build, user, cartId };
      return dataForRendering;
    } catch (err) {
      console.log(err, "error");
    }
  }

  async create(body, req, res) {
    const product = await productService.create(body);
    return product;
  }

  async getById(pid) {
    const product = await productService.getById(pid);
    return product;
  }

  async updateById(req, res, pid, body) {
    await productService.updateById(pid, body);
  }

  async deleteById(req, res, pid) {
    await productService.deleteById(pid);
  }
}
