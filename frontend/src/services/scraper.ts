import api from './api'; import { 
ScraperConfig, ScraperJob } from '../types'; 
export const scraperService = {
  // Start a new scraping job
  startScraping: async (config: 
  ScraperConfig): Promise<{ jobId: string; 
  message: string; status: string }> => {
    const response = await 
    api.post('/scraper/scrape', config); 
    return response.data;
  },
  
  // Get logs for a specific job
  getLogs: async (jobId: string): Promise<{ 
  status: string; logs: string[]; error?: 
  string }> => {
    const response = await 
    api.get(`/scraper/logs/${jobId}`); return 
    response.data;
  },
  
  // Get results for a completed job
  getResults: async (jobId: string): 
  Promise<{ results: any[] }> => {
    const response = await 
    api.get(`/scraper/results/${jobId}`); 
    return response.data;
  },
  
  // Cancel a running job
  cancelJob: async (jobId: string): Promise<{ 
  message: string }> => {
    const response = await 
    api.post(`/scraper/cancel/${jobId}`); 
    return response.data;
  },
  
  // Save a scraper configuration
  saveConfig: async (config: ScraperConfig): 
  Promise<{ configId: string; message: string 
  }> => {
    const response = await 
    api.post('/config/save', config); return 
    response.data;
  },
  
  // Get a saved configuration
  getConfig: async (configId: string): 
  Promise<ScraperConfig> => {
    const response = await 
    api.get(`/config/${configId}`); return 
    response.data;
  },
  
  // Get all user configurations
  getAllConfigs: async (): 
  Promise<ScraperConfig[]> => {
    const response = await 
    api.get('/config/all'); return 
    response.data;
  },
  
  // Delete a configuration
  deleteConfig: async (configId: string): 
  Promise<{ message: string }> => {
    const response = await 
    api.delete(`/config/${configId}`); return 
    response.data;
  },
  
  // Check robots.txt compliance
  checkRobotsTxt: async (url: string, 
  userAgent?: string): Promise<{ allowed: 
  boolean; reason?: string }> => {
    const response = await 
    api.get('/scraper/check-robots-txt', {
      params: { url, userAgent }
    });
    return response.data;
  },
};
