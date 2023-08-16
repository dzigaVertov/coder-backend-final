import express, { Router } from 'express';
import { autenticarJwtView } from '../middlewares/passport.js';
import { getTicketHandler } from '../controllers/ticketController.js';


const ticketRouter = Router();
export default ticketRouter;

ticketRouter.get('/', autenticarJwtView, getTicketHandler);
