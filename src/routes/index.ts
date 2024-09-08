import { Router } from 'express';
import UserRouter from './user';
import AdminRouter from './admin';

const router = Router();


router.use('/users', UserRouter);

router.use('/admins', AdminRouter);

export default router;
