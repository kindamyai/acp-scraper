import puppeteer from 'puppeteer'; import 
logger from '../../config/logger'; import 
config from '../../config'; export class 
BrowserManager {
  private browser: puppeteer.Browser | null = 
  null; private page: puppeteer.Page | null = 
  null;
  // Initialize the browser
  public async initialize(): Promise<void> { 
    if (this.browser) {
      return;
    }
    try { this.browser = await 
      puppeteer.launch({
        headless: true, args: [ 
          '--no-sandbox', 
          '--disable-setuid-sandbox', 
          '--disable-dev-shm-usage', 
          '--disable-accelerated-2d-canvas', 
          '--no-first-run', '--no-zygote', 
          '--disable-gpu',
        ],
      });
      this.page = await 
      this.browser.newPage();
      
      // Set default user agent
      await 
      this.page.setUserAgent(config.defaultUserAgent);
      
      // Set viewport
      await this.page.setViewport({ width: 
      1366, height: 768 });
      
      // Disable images and styles to speed 
      // up loading
      await 
      this.page.setRequestInterception(true); 
      this.page.on('request', (request) => {
        const resourceType = 
        request.resourceType(); if 
        (resourceType === 'image' || 
        resourceType === 'stylesheet' || 
        resourceType === 'font') {
          request.abort();
        } else {
          request.continue();
        }
      });
    } catch (error) {
      logger.error('Error initializing 
      browser', { error }); throw error;
    }
  }
  // Get the current page
  public async getPage(): 
  Promise<puppeteer.Page> {
    if (!this.page) { await 
      this.initialize();
    }
    
    if (!this.page) { throw new Error('Failed 
      to initialize page');
    }
    
    return this.page;
  }
  // Close the browser
  public async close(): Promise<void> { if 
    (this.browser) {
      try { await this.browser.close(); 
        this.browser = null; this.page = 
        null;
      } catch (error) {
        logger.error('Error closing browser', 
        { error });
      }
    }
  }
}
