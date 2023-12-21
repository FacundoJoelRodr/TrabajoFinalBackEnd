import { Router } from "express";
import passport from "passport";
import { createHash, isValidPassword } from "../../utils.js";
import UserModel from "../../models/user.model.js";
import UserController from "../../controller/users.controller.js";

const router = Router();

const userController = new UserController();

router.post("/register", passport.authenticate("register", { failureRedirect: "/register" }),
  (req, res) => {
    res.redirect("/api/login");
  }
);

router.post("/login",passport.authenticate("login", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/api/products");
  }
);


router.get('/github', passport.authenticate('github', {scope: ['user:email'] }))

router.get('/github/callback',passport.authenticate('github',{ failureRedirect: "/login" }), 
(req, res)=>{
req.session.user = req.user;
res.redirect("/api/products")
})

router.post("/recovery-password", async (req, res, next) => {
  
 try {
   await userController.recoveryPassword(req)
   res.redirect("/api/login");
 } catch (error) {
  next(error)
 }
});


router.get("/logout", async (req, res) => {
  try {
    await userController.destroySession()
    res.redirect("/api/login");
  } catch (error) {
    next(error)
  }
});

export default router;
