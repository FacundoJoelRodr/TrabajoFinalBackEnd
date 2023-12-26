import { Router } from "express";

import CartController from "../../controller/carts.controller.js";
import mongoose from "mongoose";

const router = Router();

const cartController = new CartController();
//// MONGO

router.post("/carts", async (req, res, next) => {
try{
  const { body } = req;
  await cartController.create(body);
  res.status(200).json(body);

}catch(error){
next(next)
}
});

router.get("/carts", async (req, res, next) => {
try{
  await cartController.get();
  res.status(200).json();
} catch(error){
next(error)
}
});

router.get("/carts/:cid", async (req, res, next) => {
  try {
    const {
      params: { cid },
    } = req;

    const cart = await cartController.getById(cid);
    console.log(cart, "cart");
    res.render("carts", { products: cart.products, cartId: cart.cartId });
  } catch (error) {
    next(error)
  }
});

/////////////////////
router.put("/carts/:cid/product/:pid", async (req, res,next) => {
  const {
    params: { cid, pid },
  } = req;
  const { quantity } = req.body;

  if (quantity === undefined) {
    return res
      .status(400)
      .json({ error: "La cantidad no se proporcionó correctamente" });
  }

  try {
    if (!mongoose.isValidObjectId(cid) || !mongoose.isValidObjectId(pid)) {
      return res.status(400).json({ error: "IDs inválidos" });
    }

    const cart = await cartController.updateProduct(cid,pid,quantity);

    res.status(201).json(cart);
  } catch (error) {
    next(error)
  }
});
///////////////////////////////
router.put("/carts/:cid", async (req, res, next) => {
  try {
    const {
      params: { cid },
      body,
    } = req;
    await cartController.updateById(cid, body);
    res.status(204).end();
  } catch (error) {
    next(error)
  }
});

router.delete("/carts/:cid", async (req, res, next) => {
  try {
    const {
      params: { cid },
    } = req;
    await cartController.deleteById(cid);
    res.status(204).end();
  } catch (error) {
    next(error)
  }
});

router.delete("/carts/:cid/product/:pid", async (req, res, next) => {
  const {
    params: { cid, pid },
  } = req;
  const { quantity } = req.body;

  if (quantity === undefined) {
    return res
      .status(400)
      .json({ error: "La cantidad no se proporcionó correctamente" });
  }

  try {
    if (!mongoose.isValidObjectId(cid) || !mongoose.isValidObjectId(pid)) {
      return res.status(400).json({ error: "IDs inválidos" });
    }

    const cart = await cartController.deleteProduct(cid, pid);

    res.status(201).json(cart);
  } catch (error) {
   next(error)
  }
});

export default router;