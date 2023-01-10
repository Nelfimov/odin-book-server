import {Router as router} from 'express';
import {commentController} from '../controllers/index.js';

const commentRouter = router({mergeParams: true});

commentRouter
    .get('/', commentController.getComments)
    .post('/', commentController.createComment);

commentRouter
    .get('/:commentID', commentController.getCommentById);

export default commentRouter;
