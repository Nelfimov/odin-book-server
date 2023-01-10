import express, {json, urlencoded} from 'express';

const app = express();
app.use(urlencoded({extended: false}));
app.use(json());

export default app;
