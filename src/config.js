import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT,
  link: process.env.LINK,
  secret_idClient: process.env.SECRET_IDCLIENT, // Aquí debe corresponder a la variable definida en el archivo .env
  secret_client: process.env.SECRET_CLIENT,
  mongoDB_URL: process.env.MONGODB_URL,
  session_secret: process.env.SESSION_SECRET,
  jwt_secret: process.env.JWT_SECRET,
  mail: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    port: process.env.EMAIL_PORT || 587,
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS || 'gmail',
  },
};
