import nodemailer from 'nodemailer';
import config from '../config.js';
class EmailService {
  constructor() {
    this.transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.user_email,
        password: config.user_pass,
      },
    });
  }

  sendEmail(to, subject, html, attachments = []) {
    return this.transport.sendMail({
      from: config.userEmail,
      to,
      subject,
      html,
      attachments,
    });
  }
}

export default new EmailService();
