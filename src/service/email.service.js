import nodemailer from 'nodemailer';
import config from '../config.js';

class EmailService {
  static #instance = null;
   constructor() {
    this.transport = nodemailer.createTransport({
      service: config.mail.service,
      port: config.mail.port,
      auth: {
        user: config.mail.user,
        password: config.mail.pass,
      },
    });
  }

 static sendEmail(to, subject, html, attachments = []) {
    return this.transport.sendMail({
      from: config.userEmail,
      to,
      subject,
      html,
      attachments,
    });
  }

  static sendWelcomeEmail(user) {
    return this.sendEmail(
      user.email, 
      `Bienvendio ${user.first_name}!`,
      `<h1>Bienvenido ${user.first_name} ya se creo correctamente tu usuario, ya esta disponible para realizar compras</h1>`,
    );
  }

  static getInstance() {
    if (!EmailService.#instance) {
      EmailService.#instance = new EmailService();
    }
    return EmailService.#instance;
  }
}

export default new EmailService();
