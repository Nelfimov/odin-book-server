import {Router as router} from 'express';

const customRouter = router();

customRouter.get('/', function(req, res, next) {
  res.json({success: true, message: 'Welcome'});
});

export default customRouter;
