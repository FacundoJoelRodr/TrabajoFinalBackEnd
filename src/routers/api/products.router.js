import { Router } from 'express';
import ProductController from '../../controller/products.controller.js';
import {
  UserMiddleware,
  generateProduct,
  jwtAuth
} from '../../utils.js';

const router = Router();

router.get('/products',UserMiddleware(['USER', 'PREMIUM', 'ADMIN']),  async (req, res, next) => {
  try {
    const products = await ProductController.get(req, res);
    res.render('products', products);
  } catch (error) {
    next(error);
  }
});

router.get('/products/:pid', UserMiddleware('USER', 'PREMIUM', 'ADMIN'),  async (req, res, next) => {
  
  try {
    const {
      params: { pid },
    } = req;
    const product = await ProductController.getById(pid);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

router.post('/mockingproducts', async (req, res, next) => {
  const products = await ProductController.get(req, res);
  for (let index = 0; index < 100; index++) {
    await ProductController.create(generateProduct());
  }
  res.status(200).json(products);
});

router.post(
  '/products',
  UserMiddleware(['PREMIUM', 'ADMIN']),
  async (req, res, next) => {
    try {
      const { body } = req;
      const product = await ProductController.create(body);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/products/add', (req, res) => {
  res.render('addProducts');
});

router.put(
  '/products/:pid',
  UserMiddleware(['PREMIUM', 'ADMIN']),
  async (req, res, next) => {
    try {
      const {
        params: { pid },
        body,
      } = req;
      await ProductController.updateById(pid, body);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/products/:pid',
  UserMiddleware(['PREMIUM', 'ADMIN']),
   async (req, res, next) => {
    try {
      const {
        params: { pid },
      } = req;
      await ProductController.deleteById(pid,req);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
