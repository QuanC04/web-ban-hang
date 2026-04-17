import { Router } from 'express';
import { registerController, loginController, logoutController } from './auth.controller';

const authRoutes: Router = Router();

authRoutes.post('/register', registerController);
authRoutes.post('/login', loginController);
authRoutes.post('/logout', logoutController);

export default authRoutes;
