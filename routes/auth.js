import {Router as router} from 'express';
import {register, login} from '../controllers/index.js';

const customRouter = router();

customRouter.post('/register', register);

customRouter.post('/login', login);

export default customRouter;
