import { Router } from "express";
import ProductController from "../../controller/products.controller.js";

const router = Router();

const productController = new ProductController(); 

router.get("/products", async (req, res) => {
  try {
    const products = await productController.get(req, res);
    console.log(products,"products");
    res.render('products', products );
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const { params: { pid } } = req;
    const product = await productController.getById(pid);
    res.status(200).json(product);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.post("/products", async (req, res) => {

  try {
    const { body } = req;
    const product = await productController.create(body);
    res.status(200).json(product);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});


router.put("/products/:pid", async (req, res) => {
  try {
    const {
      params: { pid },
      body,
    } = req;
    await productController.updateById(pid, body);
    res.status(204).end();
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.delete("/products/:pid", async (req, res) => {
  try {
    const {
      params: { pid },
    } = req;
    await productController.deleteById(pid);
    res.status(204).end();
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

export default router;
