import { Router } from 'express';
import {
    registerController,
    loginController,
    logoutController,
    refreshTokenController,
} from './auth.controller';
import { authenticate } from '../../middleware/authicate';
import { validate } from '../../middleware/validate';
import { registerSchema } from './auth.schema';

const authRoutes: Router = Router();

authRoutes.post('/register', validate(registerSchema), registerController);
authRoutes.post('/login', loginController);
authRoutes.post('/logout', authenticate, logoutController);
authRoutes.post('/refresh', refreshTokenController);

export default authRoutes;
