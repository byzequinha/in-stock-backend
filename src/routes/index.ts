import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import productRoutes from './productRoutes';
import clientRoutes from './clientRoutes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/users', userRoutes);
routes.use('/products', productRoutes);
routes.use('/clients', clientRoutes);

export default routes;
