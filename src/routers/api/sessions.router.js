import { Router } from 'express';
import passport from 'passport';
import {
  createHash,
  isValidPassword,
  tokenGenerator,
  AuthMiddleware,
} from '../../utils.js';
import UserModel from '../../models/user.model.js';
import UserController from '../../controller/users.controller.js';


const router = Router();

const userController = new UserController();

router.post('/login', async (req, res) => {
  const {
    body: { email, password },
  } = req;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'correo o contraseña invalidos' });
  }
  const isPassValid = isValidPassword(password, user);
  if (!isPassValid) {
    return res.status(401).json({ message: 'correo o contraseña invalidos' });
  }
  const token = tokenGenerator(user);
  res.cookie('access_token', token, { maxAge: 60000, httpOnly: true });
  
    req.session.user = token;
    res.redirect('/api/products');
  
});

router.get('/current', AuthMiddleware('jwt'), (req, res) => {
  console.log(req.user, "current");
  res.status(200).json(req.user);
});

router.post(
  '/register',
  passport.authenticate('register', { failureRedirect: '/register' }),
  (req, res) => {
    res.redirect('/api/login');
  }
);

/*router.post(
  '/login',
  passport.authenticate('login', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/api/products');
  }
);*/

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/api/products');
  }
);

router.post('/recovery-password', async (req, res, next) => {
  try {
    await userController.recoveryPassword(req);
    res.redirect('/api/login');
  } catch (error) {
    next(error);
  }
});

router.get('/logout', async (req, res) => {
  try {
    await userController.destroySession();
    res.redirect('/api/login');
  } catch (error) {
    next(error);
  }
});

export default router;
