import express from 'express'; import * as 
configController from 
'../controllers/config'; import { 
authenticate } from '../middlewares/auth'; 
const router = express.Router();
// All routes require authentication
router.use(authenticate);
// Routes
router.post('/save', 
configController.saveConfig); 
router.get('/all', 
configController.getUserConfigs); 
router.get('/:configId', 
configController.getConfig); 
router.delete('/:configId', 
configController.deleteConfig); 
router.post('/:configId/toggle-public', 
configController.togglePublicStatus); export 
default router;
