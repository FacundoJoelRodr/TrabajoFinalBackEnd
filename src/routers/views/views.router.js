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


  router.get('/recovery-password', async (req,res)=>{

    res.render('recovery-password', {title: 'Recuperar Contraseña'})
})

router.get('/send-recovery-password', async (req,res)=>{

  res.render('send', {title: 'Recuperar Contraseña'})
})


export default router