import { Router } from 'express';
import AuthRoutes from './auth'
import ShopRouts from './shop'

const  router =  Router();

router.use('/auth',AuthRoutes)
router.use(ShopRouts)
export default router;
