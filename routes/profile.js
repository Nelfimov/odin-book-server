import {Router as router} from 'express';
import {passport} from '../config/index.js';

const profileRouter = router();

profileRouter.use(
    passport.authenticate('jwt', {
      session: false, failWithError: true,
    }),
);

profileRouter
    .get('/', postController.getPosts);

export default profileRouter;
