import userRouter from '@/modules/user/user.router';
import * as express from 'express';

const routerV1 = express.Router();

routerV1.use('/user', userRouter);

export default routerV1;
