import productService from "../service/products.service.js";
import UserController from "../controller/users.controller.js";
import { JWT_SECRET, verificarToken } from "../utils.js";
import emailService from "../service/email.service.js";

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
  static async get(req, res) {
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

  static async create(body) {
    try {
      const product = await productService.create(body);
      return product;
    } catch (error) {
      console.error("Error en el método create:", error);
      throw new Error("Error interno del servidor");
    }
  }

  static async getById(pid) {
    try {
      const product = await productService.getById(pid);
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      return product;
    } catch (error) {
      console.error("Error en el método getById:", error);
      throw new Error("Error interno del servidor");
    }
  }

  static async updateById(pid, body) {
    try {
      await productService.updateById(pid, body);
      return "Producto actualizado exitosamente";
    } catch (error) {
      console.error("Error en el método updateById:", error);
      throw new Error("Error interno del servidor");
    }
  }
  static async deleteById(pid, req) {
    try {
      const userSession = req.session.user;
      const decodedToken = verificarToken(userSession, JWT_SECRET);
      const newuser = await UserController.getById(decodedToken.id);
  
      const product = await productService.getById(pid);
      console.log(product,"product");
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      if (newuser.role === "PREMIUM") {
        await emailService.sendAlertDeleteProduct(newuser);
        await productService.deleteById(pid);
        return "Producto eliminado exitosamente";
      }
      // Verifica si el usuario tiene permisos para eliminar el producto
      if (
        !product.owner ||
        newuser.role === "ADMIN" ||
        newuser.role === "USER" ||
        newuser._id === product.owner
      ) {
        // Elimina el producto
        await productService.deleteById(pid);
    
      } else {
        throw new Error("No tiene permisos para eliminar el producto");
      }
    } catch (error) {
      console.error("Error en el método deleteById:", error);
      throw new Error("Error interno del servidor");
    }
  }
}
