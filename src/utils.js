import path from "path";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user.password);

export class Exception extends Error {
  constructor(message, status) {
    super(message);
    this.statusCode = status;
  }
}


export class NotFoundException extends Exception {
  constructor(message, status) {
    super(message,404);
   
  }
}


export class BadRequestException extends Exception {
  constructor(message, status) {
    super(message,400);
   
  }
}



export class UnauthorizedException extends Exception {
  constructor(message, status) {
    super(message,401);
   
  }
}