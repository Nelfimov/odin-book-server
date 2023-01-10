import {Router as router} from 'express';
import {passport} from '../config/index.js';
import {Post} from '../models/index.js';
// import jwt from 'jsonwebtoken';

const postRouter = router();

postRouter.use(
    passport.authenticate('jwt', {
      session: false, failWithError: true,
    }),
);

postRouter.get('/', async (req, res, next) => {
  const posts = await Post.find({}).exec();

  return res.json({
    success: true,
    posts,
    user: req.user.friends,
  });
}).post('/', async (req, res, next) => {
  try {
    const {title, text} = req.body;
    const post = new Post({title, text, author: req.user});
    await post.save();
    return res.json({
      success: true,
      post,
    });
  } catch (err) {
    next(err);
  }
});


export default postRouter;
