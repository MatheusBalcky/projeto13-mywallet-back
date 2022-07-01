import  { Router }  from 'express';
import { registerController, loginController } from '../controllers/authControllers.js';
import { loginValidationMiddleware } from '../middlewares/loginValidationMiddleware.js';
import { registerSchemaMiddleWare } from '../middlewares/registerSchemaMiddleware.js';
import { enterController, outController } from '../controllers/enterOutController.js';
import { userValidationMiddleware } from '../middlewares/userValidationMiddleware.js';

const router = Router();

router.post('/register', registerSchemaMiddleWare, registerController);
router.post('/login', loginValidationMiddleware, loginController);
router.put('/newEnter', userValidationMiddleware, enterController);
router.put('/newOut', userValidationMiddleware, outController);

export default router;