import {Router as router} from 'express';
import {passport} from '../config/index.js';
import {postController} from '../controllers/index.js';
import commentRouter from './comment.js';

const postRouter = router();

postRouter.use(
    passport.authenticate('jwt', {
      session: false, failWithError: true,
    }),
);

postRouter.use('/:postID/comments', commentRouter);

postRouter
    .get('/', postController.getPosts)
    .post('/', postController.createPost);

postRouter
    .get('/friends', postController.getPostsFromFriends);

postRouter
    .get('/:postID', postController.getPostById)
    .patch('/:postID', postController.changePost)
    .patch('/:postID/publish', postController.publishPost);

postRouter
    .get('/:postID/like', postController.likePost);

export default postRouter;
