import  { Router }  from 'express';
import { registerController, loginController } from '../controllers/authControllers.js';
import { loginValidationMiddleware } from '../middlewares/loginValidationMiddleware.js';
import { registerSchemaMiddleWare } from '../middlewares/registerSchemaMiddleware.js';

const router = Router();

router.post('/register', registerSchemaMiddleWare, registerController);
router.post('/login', loginValidationMiddleware, loginController);

export default router;