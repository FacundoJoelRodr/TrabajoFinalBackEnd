
import express from 'express';
import passport from 'passport';
import expressSession from 'express-session';
import MongoStore from 'connect-mongo';
import handlebars from 'express-handlebars';
import path from 'path';
import { __dirname } from './utils.js';
import productRouter from './routers/api/products.router.js';
import cartRouter from './routers/api/carts.router.js';
import emailRouter from './routers/api/email.router.js';
import ticketRouter from './routers/api/ticket.router.js';
import userRouter from './routers/api/user.router.js';
import { addLogger } from './config/logger.js';
import viewSessionRouter from './routers/views/views.router.js';
import sessionRouter from './routers/api/sessions.router.js';
import User from './models/user.model.js';
import { init as initPassaportConfig } from './config/passport.config.js';
import config from './config.js';
import { Exception } from './utils.js';
import { URI } from './db/mongodb.js';
import cookieParser from 'cookie-parser';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();

const SESSION_SECRET = config.session_secret;

app.use(
  expressSession({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: URI,
      mongoOptions: {},
      ttl: 120000,
    }),
  })
);

app.get('*', (req, res, next) => {
  if (req.url !== '/api/login') {
    res.redirect('/api/login');
  } else {
    next(); // Continúa con el siguiente middleware si ya estás en '/api/login'
  }
});

const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'ADMIN' });

    if (!existingAdmin) {
      const adminUser = new User({
        first_name: 'ADMIN',
        last_name: 'ADMIN',
        email: 'adminCoder@coder.com',
        password: 'adminCod3r123',
        role: 'ADMIN',
      });

      const newUser = await adminUser.save();
      console.log('Usuario administrador creado con éxito:', newUser);
    }
  } catch (error) {
    console.error('Error al crear usuario administrador:', error);
  }
};

createAdminUser();
app.use(addLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'handlebars');

initPassaportConfig();

app.use(passport.initialize());
app.use(passport.session());

const swagggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Cisco',
      description: 'esta es la documetacion',
    },
  },
  apis: [path.join(__dirname, '..', 'docs', '**', '*/yaml')],
};

const specs = swaggerJsDoc(swagggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(
  '/api',
  productRouter,
  cartRouter,
  viewSessionRouter,
  sessionRouter,
  emailRouter,
  ticketRouter,
  userRouter
);
/*app.use('/api', cartRouter);
app.use('/api', viewSessionRouter);
app.use('/api', sessionRouter);
app.use('/api', emailRouter);
app.use('/api', ticketRouter);
app.use('/api', userRouter);
*/
app.use((error, req, res, next) => {
  if (error instanceof Exception) {
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error interno del servidor' });
  } else {
    const message = `Ha ocurrido un error desconocido: ${error.message}`;
    console.error(message);
    res.status(500).json({ status: 'error', message });
  }
});
export default app;
