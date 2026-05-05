import { Router } from 'express';
import {
    createAddressController,
    deleteAddressController,
    getAddressController,
    updateAddressController,
} from './address.controller';
import { authenticate } from '../../middleware/authicate';

const addressRoutes: Router = Router();

addressRoutes.post('/create', authenticate, createAddressController);
addressRoutes.get('/user', authenticate, getAddressController);
addressRoutes.delete('/:addressId', authenticate, deleteAddressController);
addressRoutes.put('/:addressId', authenticate, updateAddressController);

export default addressRoutes;
