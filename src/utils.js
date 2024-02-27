import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { fileURLToPath } from 'url';
import UserModel from './models/user.model.js';
import config from './config.js';
import { faker } from '@faker-js/faker';
import enumsError from './utils/EnumError.js';
const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user.password);

export const JWT_SECRET = config.jwt_secret;

export const tokenGenerator = (user) => {
  const { _id, first_name, last_name, email, role, carts } = user;
  const payload = {
    id: _id,
    first_name,
    last_name,
    email,
    role,
    carts
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '60m' });
};

export const jwtAuth = (req, res, next) => {
  const { authorization: token } = req.headers;
  if (!token) {
    res.status(401).json({ message: 'unauthorized' });
  }
  jwt.verify(token, JWT_SECRET, async (error, payload) => {
    if (error) {
      res.status(403).json({ message: 'No authorized' });
    }
    req.user = await UserModel.findById(payload.id);
    next();
  });
};



export const verificarToken = (token, secreto) => {
  try {
      const decoded = jwt.verify(token, secreto);
      console.log('Token decodificado:', decoded);
      return decoded;
  } catch (err) {
      console.error('Error al decodificar el token:', err);
      throw err;
  }
};


export const AuthMiddleware = (strategy) => (req, res, next) => {
  passport.authenticate(strategy, function (error, user, info) {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info.message ? info.message : info.toString() });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export  const UserMiddleware = (allowedRoles) => {
  return (payload,req,res,next) => {
    const user = payload.user.role; 
    if (!user || !user.role) {
      return res.status(401).json({ message: 'Acceso no autorizado' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    }
    next();
  };
};

export class Exception extends Error {
  constructor(message, status) {
    super(message);
    this.statusCode = status;
  }
}

export class NotFoundException extends Exception {
  constructor(message, status) {
    super(message, 404);
  }
}

export class BadRequestException extends Exception {
  constructor(message, status) {
    super(message, 400);
  }
}

export class UnauthorizedException extends Exception {
  constructor(message, status) {
    super(message, 401);
  }
}

export default (error, req, res, next) => {
  console.error(error.cause);
  switch (error.code) {
    case enumsError.errorclase:
      res
        .status(codigodeError)
        .json({ status: 'error', message: error.message });
      break;
    case enumsError.errorclase:
      res
        .status(codigodeError)
        .json({ status: 'error', message: error.message });
      break;
    case enumsError.errorclase:
      res
        .status(codigodeError)
        .json({ status: 'error', message: error.message });
      break;
    case enumsError.errorclase:
      res
        .status(codigodeError)
        .json({ status: 'error', message: error.message });
      break;
    default:
      res.status(500).json({ status: 'error', message: 'error desconocido' });
      break;
  }
};

export const generateProduct = () => {

  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    stock: faker.number.int({mix:10000, max:99999}),
    description: faker.commerce.productDescription(),
    code: faker.database.mongodbObjectId(),
    category: faker.commerce.productDescription(),
  };
};


