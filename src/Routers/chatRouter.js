import { Router } from 'express';
import { mensajeManager } from '../DAO/MensajeManagerMongo.js';


const chatRouter = Router();
export default chatRouter;


chatRouter.get('/', async (req, res) => {
    let mensajes = await mensajeManager.getMensajes();
    let msjs = mensajes.map(msj => ({ email: msj.email, mensaje: msj.mensaje }));
    res.render('chat', { pageTitle: 'Chat', mensajes: msjs, hayMensajes: mensajes.length > 0 });
});




