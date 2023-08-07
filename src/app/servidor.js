// Server imports
import express from 'express';
import { engine } from 'express-handlebars';
import { Server as SocketIOServer } from 'socket.io';
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

// Middleware para acceder al body del POST request
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

// server WebSocket
const httpServer = app.listen(PORT, () => console.log('Escuchando en puerto 8080'));
const io = new SocketIOServer(httpServer);

// Agregar referencia al SocketServer en la petición http
app.use((req, res, next) => {
    req['io'] = io;
    next();
});

io.on('connection', async clientSocket => {
    console.log(`Nuevo cliente conectado: socket id: ${clientSocket.id}`);
    clientSocket.on('mensaje', mensaje => {
        console.log(mensaje);
    });
    clientSocket.on('nuevoMensaje', async mensaje => {
        mensajeManager.addMensaje(mensaje);
        let mensajes = await mensajeManager.getMensajes();
        mensajes = mensajes.map(msj => ({ email: msj.email, mensaje: msj.mensaje }));
        io.sockets.emit('actualizacionMensajes', mensajes);
    });
});

app.use('/loggerTest', loggerRouter);
app.use('/', webRouter);
app.use('/api', apiRouter);


