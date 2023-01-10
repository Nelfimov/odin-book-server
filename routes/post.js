import {Router as router} from 'express';
import {passport} from '../config/index.js';
// import {Post} from '../models/index.js';

const postRouter = router();

postRouter.use(
    passport.authenticate('jwt', {
      session: false, failWithError: true, failureMessage: true,
    }),
);

postRouter.get('/', async (req, res, next) => {
  // const posts = await Post.find({}).exec();

  return res.json({
    success: true,
  });
});

export default postRouter;
