import { Router } from 'express';
import { createReviewController, getReviewsByProductIdController } from './review.controller';
import { authenticate } from '../../middleware/authicate';

const reviewRoute: Router = Router();

reviewRoute.post('/create-review', authenticate, createReviewController);
reviewRoute.get('/review/:productId', getReviewsByProductIdController);

export default reviewRoute;
