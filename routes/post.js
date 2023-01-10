import {Router as router} from 'express';
import customPassport from '../config/passport.js';
import {Post} from '../models.js';

const postRouter = router();

postRouter.use(customPassport.authenticate('jwt', {session: false}));

postRouter.get('/', async (req, res, next) => {
  const posts = await Post.find({}).exec();

  return req.json({
    success: true,
    posts,
  });
});
