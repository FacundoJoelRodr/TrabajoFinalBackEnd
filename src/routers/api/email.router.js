import { Router } from 'express';
import emailService from '../../service/email.service.js';

const router = Router();

router.get('/sendEmail', async (req, res, next) => {
  try {
    const result = await emailService.sendWelcomeEmail({
      email: 'natalia.stampella@gmail.com',
      first_name: 'Natalia!'
    });
    res.status(200).json({ message: 'Correo enviado correctamente' });
  } catch (error) {
    next(error);
  }
});

export default router;