import { Request, Response, Router } from 'express';
import routerV1 from './v1';

const router = Router();
router.use('/api/v1', routerV1);
router.use('/', (req: Request, res: Response) => {
    return res.json(`Server is running: ${new Date()}`);
});

export default router;
