import { Router } from 'express';
import { registerController, loginController, logoutController } from './auth.controller';
import { authenticate } from '../../middleware/authicate';

const authRoutes: Router = Router();

authRoutes.post('/register', registerController);
authRoutes.post('/login', loginController);
authRoutes.post('/logout',authenticate, logoutController);

export default authRoutes;
