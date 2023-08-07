import { Router } from 'express';
import * as sessionController from '../controllers/sessionController.js';

const apiSessionsRouter = Router();
export default apiSessionsRouter;


apiSessionsRouter.post('/login', sessionController.handleLogin);

apiSessionsRouter.get('/logout', sessionController.handleLogout);

apiSessionsRouter.get('/current', sessionController.handleGetCurrent);


