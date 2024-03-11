import { Router } from 'express';
import passport from 'passport';
import {
  createHash,
  isValidPassword,
  tokenGenerator,
  AuthMiddleware,
  tokenGeneratorMail
} from '../../utils.js';
import UserController from '../../controller/users.controller.js';
import emailService from '../../service/email.service.js';
const router = Router();


router.post('/login', async (req, res) => {
  const {
    body: { email, password },
  } = req;
 
  const user = await UserController.getByEmail(email);
  if (!user) {
    return res.status(401).send('<script>alert("Correo o contraseña inválidos"); window.location="/api/login";</script>');
  }

  await UserController.updateUserLastLogin(user._id, { lastLogin: new Date() });
  
  const isPassValid = isValidPassword(password, user);
  if (!isPassValid) {
    return res.status(401).send('<script>alert("Correo o contraseña inválidos"); window.location="/api/login";</script>');
  }
  const token = tokenGenerator(user);
  console.log(token, "token login");
  res.cookie('access_token', token, { maxAge: 60000, httpOnly: true });

  req.session.user = token;
  res.redirect('/api/products');
});

router.get('/current', AuthMiddleware('jwt'), (req, res) => {
  const user = req.user;
  res.status(200).json(user);
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
    const user = req.user;
   res.redirect('/api/login');
  }
);

router.delete(
  '/',
   async (req, res, next) => {
    try {
      await UserController.deleteInactiveUsers();
      res.status(204).end();
    } catch (error) {
      next(error);
    }
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
  console.log(req.query.token,"recovery");
  const token = req.query.token;
  try {
    if (!token) {
      //res.redirect('/api/send-recovery-password');    
      console.log("no hay token");
    }

    await UserController.recoveryPassword(req, res); // Pasamos res para manejar la respuesta
    res.redirect('/api/login');
  } catch (error) {
    next(error);
  }
});


router.get('/logout', async (req, res) => {
  try {
    await UserController.destroySession();
    res.redirect('/api/login');
  } catch (error) {
    next(error);
  }
});

router.post('/send-recovery-password', async (req, res, next) => {
  try {
   const user = await UserController.getByEmail(req.body.email);
   const token = tokenGenerator(user)
    res.cookie('access_token', token, { maxAge: 60000, httpOnly: true });
    await emailService.sendRecoveryPassword(user,token);
    res.redirect('/api/login');
  } catch (error) {
    next(error);
  }
});

export default router;
