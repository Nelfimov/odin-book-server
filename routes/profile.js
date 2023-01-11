import {Router as router} from 'express';
import {passport} from '../config/index.js';
import {profileController} from '../controllers/index.js';

const profileRouter = router();

profileRouter.use(
    passport.authenticate('jwt', {
      session: false, failWithError: true,
    }),
);

profileRouter
    .get('/:userID/posts', profileController.getUserPosts);

profileRouter
    .get('/:userID/comments', profileController.getUserComments);

profileRouter
    .get('/:userID/request', profileController.sendFriendRequest)
    .get('/:userID/accept', profileController.acceptFriendRequest)
    .get('/:userID/reject', profileController.rejectFriendRequest);

export default profileRouter;
