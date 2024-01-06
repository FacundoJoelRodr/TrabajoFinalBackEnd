import { Router } from 'express';
import emailService from '../../service/email.service.js';

const router = Router();

router.get('/sendEmail', async (req, res, next) => {
  try {
    const result = await emailService.sendMail(
      'soyfacujoelrodriguez@gmail.com',
      'correo de prueba',
      ` <h1>HOLA</h1> `
    );
    console.log('result', result);
    res.status(200).json({ message: 'correo enviado correctamente' });
  } catch (error) {
    next(error);
  }
});

export default router;