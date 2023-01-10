import {Router as router} from 'express';
import {passport} from '../config/index.js';
import {postController} from '../controllers/index.js';

const postRouter = router();

postRouter.use(
    passport.authenticate('jwt', {
      session: false, failWithError: true,
    }),
);

postRouter
    .get('/', postController.getPosts)
    .post('/', postController.createPost);

postRouter
    .get('/:id', postController.getPostById);

export default postRouter;
