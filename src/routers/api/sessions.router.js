import { Router } from "express";
import passport from "passport";
import { createHash, isValidPassword } from "../../utils.js";
import UserModel from "../../models/user.model.js";

const router = Router();

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

router.post("/recovery-password", async (req, res) => {
  const {
    body: { email, newPassword },
  } = req;
  const user = await UserModel.findOne({ email });
  console.log(user, "user");
  console.log(newPassword, "user111");
  if (!user) {
    return res.status(401).send("Email o contraseña incorrecto");
  }

  await UserModel.updateOne(
    { email },
    { $set: { password: createHash(newPassword) } }
  );

  res.redirect("/api/login");
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/api/login");
  });
});

export default router;
