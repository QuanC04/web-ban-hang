import { Router } from 'express';
import { createReviewController, getReviewsByProductIdController } from './review.controller';
import { authenticate } from '../../middleware/authicate';

const reviewRoute: Router = Router();

reviewRoute.post('/create-review', authenticate, createReviewController);
reviewRoute.post('/create', authenticate, createReviewController);
reviewRoute.get('/:productId', getReviewsByProductIdController);

export default reviewRoute;
