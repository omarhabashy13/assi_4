import { Router } from 'express';
import * as commentController from './comment.controller.js';

const router = Router();

router.post('/', commentController.createBulkComments);
router.patch('/:commentId', commentController.updateComment);
router.post('/find-or-create', commentController.findOrCreateComment);
router.get('/search', commentController.searchComments);
router.get('/newest/:postId', commentController.getNewestComments);
router.get('/details/:id', commentController.getCommentDetails);

export default router;