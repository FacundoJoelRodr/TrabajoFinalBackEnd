import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { createHash, isValidPassword, JWT_SECRET } from '../utils.js';
import config from '../config.js';
import CartController from '../controller/carts.controller.js';
import UserController from '../controller/users.controller.js';

const opts = {
  usernameField: 'email',
  passReqToCallback: true,
};

const githubOpts = {
  clientID: config.secret_idClient,
  clientSecret: config.secret_client,
  callbackURL: config.callbackURL,
};
 function cookieExtractor(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.access_token;
  }
  return token;
}


export const init = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserController.getById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  passport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_SECRET, 
      },
      (payload, done) => {
        return done(null, payload);
      }
    )
  );

  passport.use(
    'register',
    new LocalStrategy(opts, async (req, email, password, done) => {
      try {
        const cartUser = await CartController.create()

        const passwordHash = createHash(password)
    
        const newContent = {
          ...req.body,
          password: passwordHash,
          carts: cartUser.id
        }
     
        const newUser = await UserController.createUser(newContent);

        done(null, newUser);
      } catch (error) {
        return done(new Error('Error al registrar'), error.message);
      }
    })
  );

  passport.use(
    'login',
    new LocalStrategy(opts, async (req, email, password, done) => {
      try {
        const user = await UserController.getByEmail({ email });

        if (!user) {
          return done(new Error('Email y contraseña invalidos'));
        }
        const isPassValid = isValidPassword(password, user);
        if (!isPassValid) {
          return done(new Error('Email y contraseña invalidos!'));
        }
        done(null, user);
      } catch (error) {
        return done(new Error('Error al Iniciar Sesion'), error.message);
      }
    })
  );

  passport.use(
    'github',
    new GithubStrategy(
      githubOpts,
      async (accessToken, refreshToken, profile, done) => {
        const email = profile._json.email;
        let user = await UserController.getByEmail({ email });
        if (user) {
          return done(null, user);
        }

        user = {
          first_name: profile._json.name,
          last_name: '',
          age: 18,
          email,
          password: '',
          role: 'USER',
          provider: 'Github',
        };
        const newUser = await CartController.createUser(user);
        done(null, newUser);
      }
    )
  );
};
