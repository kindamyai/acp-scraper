import express from 'express'; import * as 
scraperController from 
'../controllers/scraper'; import { 
authenticateOptional } from 
'../middlewares/auth'; const router = 
express.Router();
// Optional authentication - allows anonymous 
// usage but identifies users if logged in
router.use(authenticateOptional);
// Routes
router.post('/scrape', 
scraperController.startScraping); 
router.get('/logs/:jobId', 
scraperController.getLogs); 
router.get('/results/:jobId', 
scraperController.getResults); 
router.post('/cancel/:jobId', 
scraperController.cancelJob); 
router.get('/check-robots-txt', 
scraperController.checkRobotsTxt); export 
default router;
