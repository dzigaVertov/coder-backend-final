import { Router } from 'express';
import passport from 'passport';
import { handleGetProfile, handleGetResetPassword } from '../controllers/userWebController.js';
import { autenticarJwtView, autenticarReset } from '../middlewares/passport.js';
// import { autenticarJwtView } from '../middlewares/passport.js';


const userRouter = Router();
export default userRouter;

userRouter.get('/', (req, res) => {
    res.redirect('/login');
});

userRouter.get('/login', (req, res) => {
    res.render('login');
});

userRouter.get('/register', (req, res) => {
    res.render('registro');
});

userRouter.get('/sendPasswordEmail', (req, res) => {
    res.render('sendPasswordEmail');
});

userRouter.get('/resetPassword', autenticarReset, handleGetResetPassword);



userRouter.get('/profile', autenticarJwtView, handleGetProfile);
