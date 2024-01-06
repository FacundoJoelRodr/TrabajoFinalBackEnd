import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT,
  secret_idClient: process.env.SECRET_IDCLIENT, // Aquí debe corresponder a la variable definida en el archivo .env
  secret_client: process.env.SECRET_CLIENT,
  mongoDB_URL: process.env.MONGODB_URL,
  session_secret: process.env.SESSION_SECRET,
  jwt_secret: process.env.JWT_SECRET,
  user_email: process.env.GMAIL_EMAIL,
  user_pass: process.env.GMAIL_PASS,
};
