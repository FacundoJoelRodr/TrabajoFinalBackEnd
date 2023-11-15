import {Router} from 'express';
import UserModel from '../../models/user.model.js'

const router = Router();


router.post('/login', async (req,res)=>{
    if(req.session.user){
        return res.redirect('/api/products')
    }
    const {body: {email, password}} = req
    const user = await UserModel.findOne({email});
    if(!user){
        return res.status(401).send("Email o contraseña incorrecto")
    }
    const isPassValid = user.password === password;
    if(!isPassValid){
        return res.status(401).send("Email o contraseña incorrecto")
    }

    const {first_name, last_name,role } = user;
    req.session.user = {first_name, last_name, email,role};
    res.redirect('/api/products')
})



router.post('/register', async (req,res)=>{

    if(req.session.user){
        return res.redirect('/api/products')
    }

    const {body} = req
    const newUser = await UserModel.create(body);
    console.log(newUser, "new user");
    res.redirect('/api/login');
})


router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/api/login');
    });
  });

export default router