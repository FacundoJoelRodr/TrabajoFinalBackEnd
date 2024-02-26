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
  const user = req.user;
  console.log(user,"user");
  res.status(200).json(req.user);
});

router.get('/loggerTest', (req, res) => {
  req.logger.debug('esta es una prueba de log debug');
  req.logger.http('esta es una prueba de log http');
  req.logger.info('esta es una prueba de log info');
  req.logger.warning('esta es una prueba de log warning');
  req.logger.error('esta es una prueba de log error');
  req.logger.fatal('esta es una prueba de log fatal');
  res.status(200).send('ok');
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
