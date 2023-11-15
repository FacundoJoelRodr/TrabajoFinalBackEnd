import {Router} from 'express';

const router = Router();

router.get('/login',(req,res)=>{

    res.render('login', {title: 'Login'})
})

router.get('/register', async (req,res)=>{

    res.render('register', {title: 'Register'})
})

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/api/login'); // Redirige a la página de inicio de sesión después de cerrar la sesión
    });
  });
export default router