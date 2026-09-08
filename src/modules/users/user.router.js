import { Router } from 'express';
import * as userController from './user.controller.js';

const router = Router();

router.post('/signup', userController.signup);
router.put('/:id', userController.upsertUser);
router.get('/by-email', userController.getUserByEmail);
router.get('/:id', userController.getUserById);

export default router;