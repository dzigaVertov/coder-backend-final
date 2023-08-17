// Server imports
import express from 'express';
import { engine } from 'express-handlebars';
import { PORT } from '../config/servidor.config.js';

// Routers
import apiRouter from '../Routers/apiRouter.js';
import webRouter from '../Routers/webRouter.js';

// Mongo imports
import mongoose from '../database/mongoose.js';

// COOKIES
import cookieParser from 'cookie-parser';
import { COOKIE_SECRET } from '../config/auth.config.js';

// PASSPORT
import { passportInitialize } from '../middlewares/passport.js';

// LOGGER
import { loggerMiddleware } from '../middlewares/logger.js';
import { loggerRouter } from '../Routers/loggerRouter.js';

const app = express();

// Archivos estáticos
app.use(express.static('./public'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(loggerMiddleware);

// Handlebars
app.engine('handlebars', engine());
app.set('views', './views');
app.set('view engine', 'handlebars');

// Cookies
app.use(cookieParser(COOKIE_SECRET));

// Passport
app.use(passportInitialize);

const httpServer = app.listen(PORT, () => console.log('Escuchando en puerto 8080'));
app.use('/loggerTest', loggerRouter);
app.use('/', webRouter);
app.use('/api', apiRouter);


