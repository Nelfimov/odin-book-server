import { Router as router } from 'express';
import { authController } from '../controllers/index.js';

const customRouter = router();

customRouter.post('/register', authController.register);
customRouter.post('/login', authController.login);
customRouter.get('/demo', authController.demo);

export default customRouter;
