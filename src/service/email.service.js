import nodemailer from 'nodemailer';
import config from '../config.js';

class EmailService {
  constructor() {
    this.transport = nodemailer.createTransport({
      service: config.mail.service,
      auth: {
        user: config.mail.user,
        pass: config.mail.pass,
      },
    });
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
    return this.sendEmail(
      user.email,
      `Registro Exitoso!!😁`,
      `<h4>Hola ${user.first_name} te damos la bienvenida a nuestro emprendimiento espero que lo disfrutes</h4><br><p>Ya estas habilitado para hacer compras!</p>`
    );
  }

  sendAlertDeleteProduct(user) {
    return this.sendEmail(
      user.email,
      `Producto Borrado`,
      `<h4>Hola ${user.first_name}! te avisamos que unos de tu productos se han borrado.`
    );
  }

  sendAlertDeleteUser(user) {
    return this.sendEmail(
      user.email,
      `Tu usuario ha sido eleminado`,
      `<h4>Hola ${user.first_name}! lamentablemente te avisamos que tu usuario ha sido elimando ya que han pasado mas 48hs sin conexion! .`
    );
  }
}

export default new EmailService();
