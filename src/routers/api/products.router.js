import { Router } from "express";
import ProductController from "../../controller/products.controller.js";

const router = Router();

const productController = new ProductController(); 

router.get("/products", async (req, res, next) => {
  try {
    const products = await productController.get(req, res);
    console.log(products,"products");
    res.render('products', products );
  } catch (error) {
   next(error)
  }
});

router.get("/products/:pid", async (req, res, next) => {
  try {
    const { params: { pid } } = req;
    const product = await productController.getById(pid);
    res.status(200).json(product);
  } catch (error) {
    next(error)
  }
});

router.post("/products", async (req, res, next) => {

  try {
    const { body } = req;
    const product = await productController.create(body);
    res.status(200).json(product);
  } catch (error) {
   next(error)
  }
});


router.put("/products/:pid", async (req, res, next) => {
  try {
    const {
      params: { pid },
      body,
    } = req;
    await productController.updateById(pid, body);
    res.status(204).end();
  } catch (error) {
    next(error)
  }
});

router.delete("/products/:pid", async (req, res, next) => {
  try {
    const {
      params: { pid },
    } = req;
    await productController.deleteById(pid);
    res.status(204).end();
  } catch (error) {
    next(error)
  }
});

export default router;