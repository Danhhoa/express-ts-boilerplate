import fileRouter from '@/modules/file/file.router';
import userRouter from '@/modules/user/user.router';
import * as express from 'express';

const routerV1 = express.Router();

routerV1.use('/user', userRouter);
routerV1.use('/file', fileRouter);

export default routerV1;
