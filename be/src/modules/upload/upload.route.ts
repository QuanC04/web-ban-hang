import { Router } from 'express';
import multer from 'multer';
import { deleteImageByKeyController, uploadController } from './upload.controller';
import { authenticate } from '../../middleware/authicate';
import { requireAdmin } from '../../middleware/requireAdmin';

const uploadRoute: Router = Router();
const upload = multer({ storage: multer.memoryStorage() });
uploadRoute.post('/image', authenticate, requireAdmin, upload.single('file'), uploadController);
uploadRoute.delete('/image', authenticate, requireAdmin, deleteImageByKeyController);

export default uploadRoute;
