import  { Router }  from 'express';
import { registerController, loginController } from '../controllers/authControllers.js';
import { loginValidationMiddleware, registerValidationMiddleWare } from '../middlewares/authValidationMiddle.js';

import { valuesValidationMiddle } from '../middlewares/valuesValidationMiddle.js';
import { tokenValidationMiddle } from '../middlewares/tokenValidationMiddle.js';

import { enterController, outController, getEntersAndOutsController } from '../controllers/enterOutController.js';


const router = Router();

router.post('/register', registerValidationMiddleWare, registerController);
router.post('/login', loginValidationMiddleware, loginController);
router.get('/home', tokenValidationMiddle, getEntersAndOutsController)
router.put('/newEnter', tokenValidationMiddle, valuesValidationMiddle, enterController);
router.put('/newOut', tokenValidationMiddle, valuesValidationMiddle, outController);

export default router;