import { Router } from 'express';
import AuthRoutes from './auth'
import ProductRoutes from "./product";


const  router =  Router();

router.use('/auth',AuthRoutes);
router.use('/products',ProductRoutes);
export default router;
