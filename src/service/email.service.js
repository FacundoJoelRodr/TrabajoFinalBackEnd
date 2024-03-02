import nodemailer from 'nodemailer';
import config from '../config.js';

class EmailService {

  constructor() {
    this.transport = nodemailer.createTransport(
      {
        service: config.mail.service,
        auth: {
          user: config.mail.user,
          pass: config.mail.pass,
        },
      }
    );
  }
  sendEmail(to, subject, html, attachments = []) {
    return this.transport.sendMail({
      from: config.mail.user,
      to,
      subject,
      html,
      attachments,
    });
  }

  sendWelcomeEmail(user) {
    console.log(user.email,"user mail");
    console.log(user.first_name,"user mail");
    return this.sendEmail(
      user.email,
      `Registro Exitoso!!😁`,
      `<h4>Hola ${user.first_name} te damos la bienvenida a nuestro emprendimiento espero que lo disfrutes</h4><br><p>Ya estas habilitado para hacer compras!</p>`
      
    );
  }
}

export default new EmailService();