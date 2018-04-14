import express from 'express';
import passport from 'passport';

import AuthenticationController from './controllers/authentication';
import passportService from './services/passport';

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });


export default function (app) {

  const apiRoutes = express.Router(),
    authRoutes = express.Router(),
    userRoutes= express.Router();


  // Auth Routes
  apiRoutes.use('/auth', authRoutes);
 
// register and login for user 

 authRoutes.post('/register', AuthenticationController.register); // BASE_URL: localhost:3000/api/auth/register
  authRoutes.post('/login', AuthenticationController.login); // BASE_URL: localhost:3000/api/auth/login


// User Routes
   apiRoutes.use('/users', userRoutes);
   userRoutes.get('/:user_id', requireAuth, AuthenticationController.getUser); // BASE_URL: localhost:3000/api/users/{user_id}


   // random string

   apiRoutes.post('/data', AuthenticationController.randomStrings); // BASE_URL: localhost:3000/api/data


  // Set url for API group routes
  app.use('/api', apiRoutes);
};
