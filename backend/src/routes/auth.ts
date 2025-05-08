import express from 'express'; import * as 
authController from '../controllers/auth'; 
import { authenticate } from 
'../middlewares/auth'; const router = 
express.Router();
// Public routes
router.post('/register', 
authController.register); 
router.post('/login', authController.login); 
router.post('/logout', 
authController.logout);
// Protected routes
router.get('/me', authenticate, 
authController.getCurrentUser); export 
default router;
