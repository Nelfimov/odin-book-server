import { Router as router } from 'express';

const customRouter = router();

customRouter.get('/', function (req, res) {
  res.json({
    success: true,
    message: 'Welcome. You need to authorize to access this site',
  });
});

export default customRouter;
