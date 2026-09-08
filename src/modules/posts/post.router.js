import { Router } from 'express';
import * as postController from './post.controller.js';

const router = Router();

router.post('/', postController.createPost);
router.delete('/:postId', postController.deletePost);
router.get('/details', postController.getPostsDetails);
router.get('/comment-count', postController.getPostsCommentCount);

export default router;