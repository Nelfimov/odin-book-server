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
    .post('/:userID/request', async function(req, res, next) {
      const result = await req.user.sendFriendRequest(req.params.userID);
      return res.json(result);
    });

profileRouter
    .post('/:userID/accept', async function(req, res, next) {
      const result = await req.user.acceptFriendRequest(req.params.userID);
      return res.json(result);
    });

profileRouter
    .post('/:userID/reject', async function(req, res, next) {
      const result = await req.user.rejectFriendRequest(req.params.userID);
      return res.json(result);
    });

export default profileRouter;
