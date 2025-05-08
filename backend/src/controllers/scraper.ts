import { Request, Response, NextFunction } 
from 'express'; import { v4 as uuidv4 } from 
'uuid'; import { validateRobotsTxt } from 
'../services/robotsTxt'; import logger from 
'../config/logger'; import Job from 
'../models/Job'; import { AppError } from 
'../middlewares/error'; import { 
BrowserManager } from 
'../services/scraper/browser'; import * as 
cheerio from 'cheerio'; import axios from 
'axios'; import puppeteer from 'puppeteer';
// Map to store active scrapers
const activeJobs = new Map<string, { browser: 
  BrowserManager; isRunning: boolean; 
  isCancelled: boolean; logs: string[]; 
  results: any[]; createdAt: Date;
}>();
// Clean up old jobs (run periodically)
const cleanupOldJobs = () => { const now = 
  new Date(); activeJobs.forEach((job, jobId) 
  => {
    const ageInMs = now.getTime() - 
    job.createdAt.getTime(); if (ageInMs > 24 
    * 60 * 60 * 1000) { // 24 hours
      // If the job is still running, cancel 
      // it
      if (job.isRunning) { job.isCancelled = 
        true;
      }
      // Close browser
      job.browser.close();
      // Remove from active jobs
      activeJobs.delete(jobId);
    }
  });
};
// Run cleanup every hour
setInterval(cleanupOldJobs, 60 * 60 * 1000);
// Start a new scraping job
export const startScraping = async (req: 
Request, res: Response, next: NextFunction) 
=> {
  try {
    // Generate a unique job ID
    const jobId = uuidv4();
    
    // Parse the request body as 
    // ScraperConfig
    const config = req.body;
    
    // Validate configuration
    if (!config.url) { throw new 
      AppError('URL is required', 400);
    }
    
    // Ensure the URL has a protocol
    if (!config.url.startsWith('http')) { 
      config.url = `https://${config.url}`;
    }
    
    // Create browser manager
    const browserManager = new 
    BrowserManager();
    
    // Store in active jobs
    activeJobs.set(jobId, { browser: 
      browserManager, isRunning: false, 
      isCancelled: false, logs: ['Scraper 
      initialized'], results: [], createdAt: 
      new Date()
    });
    
    // Save job to database
    await Job.create({ jobId, userId: 
      req.user ? req.user._id : null, config, 
      status: 'queued', logs: ['Scraper 
      initialized'], createdAt: new Date()
    });
    
    // Start scraping in the background
    (async () => { const job = 
      activeJobs.get(jobId); if (!job) 
      return;
      
      job.isRunning = true;
      
      try { await Job.findOneAndUpdate({ 
        jobId }, { status: 'running' });
        
        // Add initial log
        job.logs.push(`Starting scraping job 
        for ${config.url}`);
        
        // Check robots.txt if enabled
        if (config.respectRobotsTxt) { 
          job.logs.push('Checking robots.txt 
          compliance...'); const robotsCheck 
          = await 
          validateRobotsTxt(config.url, 
          config.userAgent);
          
          if (!robotsCheck.allowed) { 
            job.logs.push(`Scraping 
            disallowed by robots.txt: 
            ${robotsCheck.reason}`); await 
            Job.findOneAndUpdate(
              { jobId }, { status: 'failed', 
                logs: job.logs, error: 
                `Scraping disallowed by 
                robots.txt: 
                ${robotsCheck.reason}`, 
                completedAt: new Date()
              }
            ); job.isRunning = false; return;
          }
          
          job.logs.push('Robots.txt check 
          passed');
        }
        
        // Handle login if required
        if (config.loginRequired) { 
          job.logs.push('Logging in to the 
          website...');
          
          if (!config.username || 
          !config.password) {
            job.logs.push('Username and 
            password are required for 
            login'); throw new 
            Error('Username and password are 
            required for login');
          }
          
          await browserManager.initialize(); 
          const page = await 
          browserManager.getPage();
          
          // Navigate to the website
          await page.goto(config.url, { 
          waitUntil: 'networkidle2' }); 
          job.logs.push('Navigated to the 
          website');
          
          // Find and fill the login form
          const usernameInput = await 
          page.$('input[type="email"], 
          input[type="text"], 
          input[name="username"], 
          input[name="email"]'); const 
          passwordInput = await 
          page.$('input[type="password"]'); 
          const loginButton = await 
          page.$('button[type="submit"], 
          input[type="submit"]');
          
          if (!usernameInput || 
          !passwordInput) {
            job.logs.push('Could not find 
            username or password input 
            fields'); throw new Error('Could 
            not find username or password 
            input fields');
          }
          
          // Fill the form
          await 
          usernameInput.type(config.username); 
          await 
          passwordInput.type(config.password);
          
          if (loginButton) { await 
            loginButton.click(); await 
            page.waitForNavigation({ 
            waitUntil: 'networkidle2' });
          } else {
            // Try submitting the form if no 
            // button found
            await 
            page.keyboard.press('Enter'); 
            await page.waitForNavigation({ 
            waitUntil: 'networkidle2' });
          }
          
          // Check if login was successful 
          // (this is a simple check, may 
          // need to be customized)
          const currentUrl = page.url(); if 
          (currentUrl.includes('login') || 
          currentUrl.includes('signin')) {
            job.logs.push('Login failed - 
            still on login page'); throw new 
            Error('Login failed - still on 
            login page');
          }
          
          job.logs.push('Login successful');
        }
        
        // Extract data based on the selected 
        // method
        switch (config.extractionMethod) { 
          case 'css':
            await 
            extractWithCssSelector(jobId, 
            config); break;
          case 'xpath': await 
            extractWithXPath(jobId, config); 
            break;
          case 'visual': await 
            extractWithVisualSelector(jobId, 
            config); break;
          case 'ai': await 
            extractWithAiDescription(jobId, 
            config); break;
          default: throw new 
            Error(`Unsupported extraction 
            method: 
            ${config.extractionMethod}`);
        }
        
        // Save results to database
        const updatedJob = 
        activeJobs.get(jobId); if 
        (updatedJob) {
          await Job.findOneAndUpdate( { jobId 
            },
            { status: 'completed', results: 
              updatedJob.results, logs: 
              updatedJob.logs, completedAt: 
              new Date()
            }
          );
          
          updatedJob.isRunning = false; 
          updatedJob.logs.push(`Scraping job 
          completed successfully. Extracted 
          ${updatedJob.results.length} 
          items.`);
        }
        
        logger.info(`Scraping job ${jobId} 
        completed successfully`);
      } catch (error) {
        const errorMessage = error instanceof 
        Error ? error.message : 
        String(error); logger.error(`Scraping 
        job ${jobId} failed`, { error });
        
        const updatedJob = 
        activeJobs.get(jobId); if 
        (updatedJob) {
          updatedJob.isRunning = false; 
          updatedJob.logs.push(`Scraping 
          failed: ${errorMessage}`);
          
          // Update job status in database
          await Job.findOneAndUpdate( { jobId 
            },
            { status: 'failed', logs: 
              updatedJob.logs, error: 
              errorMessage, completedAt: new 
              Date()
            }
          );
        }
        
        // Clean up browser
        try { await browserManager.close();
        } catch (closeError) {
          logger.error(`Error closing browser 
          for job ${jobId}`, { error: 
          closeError });
        }
      }
    })();
    
    // Respond with the job ID
    res.status(202).json({ jobId, message: 
      'Scraping job started successfully', 
      status: 'queued'
    });
  } catch (error) {
    next(error);
  }
};
// Extract data using CSS selectors
async function extractWithCssSelector(jobId: 
string, config: any) {
  const job = activeJobs.get(jobId); if 
  (!job) return;
  
  if (!config.cssSelector) { 
    job.logs.push('CSS selector is 
    required'); throw new Error('CSS selector 
    is required');
  }
  
  job.logs.push(`Extracting data with CSS 
  selector: ${config.cssSelector}`);
  
  let currentUrl = config.url; let pageNum = 
  1; let hasMorePages = true;
  
  while (hasMorePages && !job.isCancelled) {
    // Delay between requests if specified
    if (pageNum > 1 && config.requestDelay > 
    0) {
      await new Promise(resolve => 
      setTimeout(resolve, 
      config.requestDelay));
    }
    
    job.logs.push(`Processing page 
    ${pageNum}: ${currentUrl}`);
    
    // Get the page content
    const response = await 
    axios.get(currentUrl, {
      headers: { 'User-Agent': 
        config.userAgent,
      },
    });
    
    const html = response.data; const $ = 
    cheerio.load(html);
    
    // Extract data with CSS selector
    const elements = $(config.cssSelector); 
    job.logs.push(`Found ${elements.length} 
    elements matching the selector`);
    
    elements.each((i, el) => { const element 
      = $(el); const text = 
      element.text().trim(); const html = 
      element.html() || ''; const href = 
      element.attr('href') || '';
      
      const data = { text, html, href,
        // Add other attributes as needed
        url: currentUrl, pageNum,
      };
      
      job.results.push(data);
      
      // If this is a test run, limit to 5 
      // results
      if (config.testRun && 
      job.results.length >= 5) {
        hasMorePages = false; 
        job.logs.push('Test run completed, 
        stopping after 5 results'); return 
        false; // Break the each loop
      }
    });
    
    // Handle pagination if enabled
    if (config.enablePagination && 
    hasMorePages) {
      const nextPageUrl = getNextPageUrl($, 
      currentUrl, config); if (nextPageUrl && 
      nextPageUrl !== currentUrl) {
        currentUrl = nextPageUrl; pageNum++;
      } else {
        hasMorePages = false; 
        job.logs.push('No more pages found');
      }
    } else {
      hasMorePages = false;
    }
  }
}
// Extract data using XPath
async function extractWithXPath(jobId: 
string, config: any) {
  const job = activeJobs.get(jobId); if 
  (!job) return;
  
  if (!config.xpathExpression) { 
    job.logs.push('XPath expression is 
    required'); throw new Error('XPath 
    expression is required');
  }
  
  job.logs.push(`Extracting data with XPath: 
  ${config.xpathExpression}`);
  
  // For XPath, we need to use Puppeteer
  await job.browser.initialize(); const page 
  = await job.browser.getPage();
  
  let currentUrl = config.url; let pageNum = 
  1; let hasMorePages = true;
  
  while (hasMorePages && !job.isCancelled) {
    // Delay between requests if specified
    if (pageNum > 1 && config.requestDelay > 
    0) {
      await new Promise(resolve => 
      setTimeout(resolve, 
      config.requestDelay));
    }
    
    job.logs.push(`Processing page 
    ${pageNum}: ${currentUrl}`);
    
    // Navigate to the page
    await page.goto(currentUrl, { waitUntil: 
    'networkidle2' });
    
    // Extract elements using XPath
    const elements = await 
    page.$x(config.xpathExpression); 
    job.logs.push(`Found ${elements.length} 
    elements matching the XPath expression`);
    
    for (const element of elements) { const 
      textContent = await page.evaluate(el => 
      el.textContent.trim(), element); const 
      innerHTML = await page.evaluate(el => 
      el.innerHTML, element); const href = 
      await page.evaluate(el => 
      el.getAttribute('href') || '', 
      element);
      
      const data = { text: textContent, html: 
        innerHTML, href, url: currentUrl, 
        pageNum,
      };
      
      job.results.push(data);
      
      // If this is a test run, limit to 5 
      // results
      if (config.testRun && 
      job.results.length >= 5) {
        hasMorePages = false; 
        job.logs.push('Test run completed, 
        stopping after 5 results'); break;
      }
    }
    
    // Handle pagination if enabled
    if (config.enablePagination && 
    hasMorePages) {
      const nextPageButton = await 
      findNextPageButton(page, config); if 
      (nextPageButton) {
        await nextPageButton.click(); await 
        page.waitForNavigation({ waitUntil: 
        'networkidle2' }); currentUrl = 
        page.url(); pageNum++;
      } else {
        hasMorePages = false; 
        job.logs.push('No more pages found');
      }
    } else {
      hasMorePages = false;
    }
  }
}
// Extract data using Visual Selectors
async function 
extractWithVisualSelector(jobId: string, 
config: any) {
  const job = activeJobs.get(jobId); if 
  (!job) return;
  
  if (!config.visualSelections || 
  config.visualSelections.length === 0) {
    job.logs.push('Visual selections are 
    required'); throw new Error('Visual 
    selections are required');
  }
  
  job.logs.push(`Extracting data with 
  ${config.visualSelections.length} visual 
  selectors`);
  
  await job.browser.initialize(); const page 
  = await job.browser.getPage();
  
  let currentUrl = config.url; let pageNum = 
  1; let hasMorePages = true;
  
  while (hasMorePages && !job.isCancelled) {
    // Delay between requests if specified
    if (pageNum > 1 && config.requestDelay > 
    0) {
      await new Promise(resolve => 
      setTimeout(resolve, 
      config.requestDelay));
    }
    
    job.logs.push(`Processing page 
    ${pageNum}: ${currentUrl}`);
    
    // Navigate to the page
    await page.goto(currentUrl, { waitUntil: 
    'networkidle2' });
    
    // If infinite scrolling is enabled, 
    // scroll to load all content
    if (config.enableInfiniteScroll) { await 
      handleInfiniteScroll(page, config, 
      job);
    }
    
    // Get the container selector if 
    // available
    const containerSelector = 
    config.visualSelections.find((s: any) => 
    s.label === 'container')?.selector;
    
    if (containerSelector) {
      // If we have a container, each 
      // container represents one item
      const containers = await 
      page.$$(containerSelector); 
      job.logs.push(`Found 
      ${containers.length} containers 
      matching the selector`);
      
      for (const container of containers) { 
        const item: Record<string, any> = {};
        
        // Extract data from each field 
        // selector within the container 
        // context
        for (const selection of 
        config.visualSelections) {
          if (selection.label !== 
          'container') {
            try { const fieldElement = await 
              container.$(selection.selector); 
              if (fieldElement) {
                const text = await 
                page.evaluate(el => 
                el.textContent.trim(), 
                fieldElement); const href = 
                await page.evaluate(el => 
                el.getAttribute('href') || 
                '', fieldElement);
                
                item[selection.label] = text; 
                if (href) {
                  item[`${selection.label}_url`] 
                  = href.startsWith('http') ? 
                  href : new URL(href, 
                  page.url()).href;
                }
              }
            } catch (error) {
              job.logs.push(`Error extracting 
              field ${selection.label}: 
              ${error instanceof Error ? 
              error.message : 
              String(error)}`);
            }
          }
        }
        
        // Add the item if it has at least 
        // one property
        if (Object.keys(item).length > 0) { 
          item.url = page.url(); 
          job.results.push(item);
          
          // If this is a test run, limit to 
          // 5 results
          if (config.testRun && 
          job.results.length >= 5) {
            hasMorePages = false; 
            job.logs.push('Test run 
            completed, stopping after 5 
            results'); break;
          }
        }
      }
    } else {
      // No container, so we have individual 
      // selectors
      const item: Record<string, any> = { 
      url: page.url() };
      
      for (const selection of 
      config.visualSelections) {
        try { const elements = await 
          page.$$(selection.selector); if 
          (elements.length === 1) {
            // Single element
            const text = await 
            page.evaluate(el => 
            el.textContent.trim(), 
            elements[0]); const href = await 
            page.evaluate(el => 
            el.getAttribute('href') || '', 
            elements[0]);
            
            item[selection.label] = text; if 
            (href) {
              item[`${selection.label}_url`] 
              = href.startsWith('http') ? 
              href : new URL(href, 
              page.url()).href;
            }
          } else if (elements.length > 1) {
            // Multiple elements, collect as 
            // array
            const values = await 
            Promise.all(elements.map(async 
            (el) => {
              const text = await 
              page.evaluate(el => 
              el.textContent.trim(), el); 
              return text;
            }));
            item[selection.label] = values;
          }
        } catch (error) {
          job.logs.push(`Error extracting 
          field ${selection.label}: ${error 
          instanceof Error ? error.message : 
          String(error)}`);
        }
      }
      
      // Add the item if it has at least one 
      // property besides url
      if (Object.keys(item).length > 1) { 
        job.results.push(item);
      }
    }
    
    // Handle pagination if enabled
    if (config.enablePagination && 
    hasMorePages) {
      const nextPageButton = await 
      findNextPageButton(page, config); if 
      (nextPageButton) {
        await nextPageButton.click(); await 
        page.waitForNavigation({ waitUntil: 
        'networkidle2' }); currentUrl = 
        page.url(); pageNum++;
      } else {
        hasMorePages = false; 
        job.logs.push('No more pages found');
      }
    } else {
      hasMorePages = false;
    }
  }
}
// Extract data using AI Description
async function 
extractWithAiDescription(jobId: string, 
config: any) {
  const job = activeJobs.get(jobId); if 
  (!job) return;
  
  if (!config.aiDescription) { 
    job.logs.push('AI description is 
    required'); throw new Error('AI 
    description is required');
  }
  
  job.logs.push(`Extracting data with AI 
  description: "${config.aiDescription}"`);
  
  await job.browser.initialize(); const page 
  = await job.browser.getPage();
  
  let currentUrl = config.url; let pageNum = 
  1; let hasMorePages = true;
  
  while (hasMorePages && !job.isCancelled) {
    // Delay between requests if specified
    if (pageNum > 1 && config.requestDelay > 
    0) {
      await new Promise(resolve => 
      setTimeout(resolve, 
      config.requestDelay));
    }
    
    job.logs.push(`Processing page 
    ${pageNum}: ${currentUrl}`);
    
    // Navigate to the page
    await page.goto(currentUrl, { waitUntil: 
    'networkidle2' });
    
    // If infinite scrolling is enabled, 
    // scroll to load all content
    if (config.enableInfiniteScroll) { await 
      handleInfiniteScroll(page, config, 
      job);
    }
    
    // Use AI-based data extraction 
    // (simplified implementation)
    const items = await 
    extractWithNaturalLanguage(page, 
    config.aiDescription); 
    job.logs.push(`Extracted ${items.length} 
    items from page ${pageNum}`);
    
    // Add items to results
    job.results.push(...items);
    
    // If this is a test run, limit to 5 
    // results
    if (config.testRun && job.results.length 
    >= 5) {
      hasMorePages = false; 
      job.logs.push('Test run completed, 
      stopping after 5 results'); break;
    }
    
    // Handle pagination if enabled
    if (config.enablePagination && 
    hasMorePages) {
      const nextPageButton = await 
      findNextPageButton(page, config); if 
      (nextPageButton) {
        await nextPageButton.click(); await 
        page.waitForNavigation({ waitUntil: 
        'networkidle2' }); currentUrl = 
        page.url(); pageNum++;
      } else {
        hasMorePages = false; 
        job.logs.push('No more pages found');
      }
    } else {
      hasMorePages = false;
    }
  }
}
// Helper function to extract data using 
// natural language description
async function 
extractWithNaturalLanguage(page: 
puppeteer.Page, description: string): 
Promise<any[]> {
  const items: any[] = [];
  // This is a simplified implementation of AI-based extraction
  // In a real implementation, this would use NLP/ML to understand the user's request
  
  // Parse the description to identify entity types and patterns
  // For example, if the description mentions "product names and prices",
  // we would look for elements that might contain product information
  
  // Simple heuristics for extracting common data types based on the description
  const extractPrice = description.toLowerCase().includes('price');
  const extractTitle = description.toLowerCase().includes('title') || description.toLowerCase().includes('name');
  const extractDescription = description.toLowerCase().includes('description');
  const extractImage = description.toLowerCase().includes('image');
  const extractLinks = description.toLowerCase().includes('link');
  
  // Identify potential item containers
  // Look for repeated elements that might be product cards, list items, etc.
  const potentialContainers = [
    '.product', '.item', '.card', 'article', 'li.listing', '.result', 
    '[class*="product"]', '[class*="item"]', '[class*="card"]'
  ];
  
  for (const containerSelector of potentialContainers) {
    const containers = await page.$$(containerSelector);
    
    if (containers.length > 0) {
      for (const container of containers) {
        const item: Record<string, any> = { url: page.url() };
        
        // Extract title/name
        if (extractTitle) {
          const titleSelectors = ['h1', 'h2', 'h3', '.title', '.name', '[class*="title"]', '[class*="name"]'];
          for (const selector of titleSelectors) {
            try {
              const titleElement = await container.$(selector);
              if (titleElement) {
                const text = await page.evaluate(el => el.textContent.trim(), titleElement);
                if (text) {
                  item.title = text;
                  break;
                }
              }
            } catch (error) {
              // Continue to next selector
            }
          }
        }
        
        // Extract price
        if (extractPrice) {
          const priceSelectors = ['.price', '[class*="price"]', 'span:contains("$")', 'span:contains("€")'];
          for (const selector of priceSelectors) {
            try {
              const priceElement = await container.$(selector);
              if (priceElement) {
                const text = await page.evaluate(el => el.textContent.trim(), priceElement);
                if (text && /[$€£¥]|[0-9]+\.[0-9]+/.test(text)) {
                  item.price = text;
                  break;
                }
              }
            } catch (error) {
              // Continue to next selector
            }
          }
        }
        
        // Extract description
        if (extractDescription) {
          const descSelectors = ['.description', 'p', '[class*="description"]', '[class*="desc"]'];
          for (const selector of descSelectors) {
            try {
              const descElement = await container.$(selector);
              if (descElement) {
                const text = await page.evaluate(el => el.textContent.trim(), descElement);
                if (text && text.length > 20 && !item.description) {
                  item.description = text;
                  break;
                }
              }
            } catch (error) {
              // Continue to next selector
            }
          }
        }
        
        // Extract image
        if (extractImage) {
          try {
            const imgElement = await container.$('img');
            if (imgElement) {
              const src = await page.evaluate(el => el.getAttribute('src'), imgElement);
              if (src) {
                item.image = src.startsWith('http') ? src : new URL(src, page.url()).href;
              }
            }
          } catch (error) {
            // Continue
          }
        }
        
        // Extract link
        if (extractLinks) {
          try {
            const linkElement = await container.$('a');
            if (linkElement) {
              const href = await page.evaluate(el => el.getAttribute('href'), linkElement);
              if (href) {
                item.link = href.startsWith('http') ? href : new URL(href, page.url()).href;
              }
            }
          } catch (error) {
            // Continue
          }
        }
        
        // Add the item if it has at least one property besides url
        if (Object.keys(item).length > 1) {
          items.push(item);
        }
      }
      
      // If we found items using this container selector, stop trying other selectors
      if (items.length > 0) {
        break;
      }
    }
  }
  
  return items;
}

// Helper function to handle infinite scrolling
async function handleInfiniteScroll(page: puppeteer.Page, config: any, job: any): Promise<void> {
  job.logs.push('Handling infinite scrolling...');
  
  // Default values if not provided
  const scrollDelay = config.scrollDelay || 1000;
  const maxScrollAttempts = config.maxScrollAttempts || 10;
  
  let previousHeight = 0;
  let scrollCount = 0;
  let scrolledToBottom = false;
  
  while (scrollCount < maxScrollAttempts && !scrolledToBottom && !job.isCancelled) {
    // Get current scroll height
    previousHeight = await page.evaluate('document.body.scrollHeight');
    
    // Scroll to bottom
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    
    // Wait for page to load more content
    await page.waitForTimeout(scrollDelay);
    
    // Check if we've reached the bottom
    const newHeight = await page.evaluate('document.body.scrollHeight');
    if (newHeight === previousHeight) {
      scrolledToBottom = true;
      job.logs.push('Reached the bottom of the page');
    } else {
      scrollCount++;
      job.logs.push(`Scrolled ${scrollCount} times, loading more content...`);
    }
  }
  
  // Scroll back to top to ensure we can access elements at the top of the page
  await page.evaluate('window.scrollTo(0, 0)');
  await page.waitForTimeout(500);
}

// Helper function to find the next page button
async function findNextPageButton(page: puppeteer.Page, config: any): Promise<puppeteer.ElementHandle<Element> | null> {
  if (config.paginationSelector) {
    // Use the provided selector
    return await page.$(config.paginationSelector);
  }
  
  // Try common selectors for pagination
  const nextPageSelectors = [
    'a[rel="next"]',
    'a.next',
    'a:has(span:contains("Next"))',
    'a:contains("Next")',
    'a:contains("Next Page")',
    'a:contains("»")',
    'a[aria-label="Next"]',
    'button:contains("Next")',
    'button:has(svg[aria-label="Next"])',
    '.pagination a:last-child',
    '.pagination-next a',
  ];
  
  for (const selector of nextPageSelectors) {
    try {
      const element = await page.$(selector);
      if (element) {
        // Check if the button is enabled/visible
        const isEnabled = await page.evaluate(el => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && 
                 style.visibility !== 'hidden' && 
                 !el.hasAttribute('disabled') && 
                 el.getAttribute('aria-disabled') !== 'true';
        }, element);
        
        if (isEnabled) {
          return element;
        }
      }
    } catch (error) {
      // Continue trying other selectors
    }
  }
  
  return null;
}

// Helper function to get the next page URL from cheerio
function getNextPageUrl($: cheerio.CheerioAPI, currentUrl: string, config: any): string | null {
  if (config.paginationUrlPattern) {
    // Use the provided URL pattern
    const currentUrlObj = new URL(currentUrl);
    const pathParts = currentUrlObj.pathname.split('/');
    
    // Try to find the page number in the URL
    let pageNum = 1;
    for (let i = 0; i < pathParts.length; i++) {
      if (pathParts[i] === 'page' && i + 1 < pathParts.length) {
        pageNum = parseInt(pathParts[i + 1], 10);
        break;
      } else if (/p=\d+/.test(currentUrlObj.search)) {
        const match = currentUrlObj.search.match(/p=(\d+)/);
        if (match) {
          pageNum = parseInt(match[1], 10);
          break;
        }
      } else if (/page=\d+/.test(currentUrlObj.search)) {
        const match = currentUrlObj.search.match(/page=(\d+)/);
        if (match) {
          pageNum = parseInt(match[1], 10);
          break;
        }
      }
    }
    
    // Generate the next page URL
    const nextPageUrl = config.paginationUrlPattern.replace('{page}', String(pageNum + 1));
    
    // If it's a relative URL, resolve it against the current URL
    if (nextPageUrl.startsWith('/')) {
      const baseUrl = `${currentUrlObj.protocol}//${currentUrlObj.host}`;
      return baseUrl + nextPageUrl;
    } else if (!nextPageUrl.startsWith('http')) {
      return new URL(nextPageUrl, currentUrl).href;
    }
    
    return nextPageUrl;
  }
  
  // Try to find the next page link
  const nextLink = $('a[rel="next"], a.next, a:contains("Next"), a:contains("Next Page"), a:contains("»")');
  if (nextLink.length > 0) {
    const href = nextLink.attr('href');
    if (href) {
      // If it's a relative URL, resolve it against the current URL
      if (href.startsWith('/')) {
        const currentUrlObj = new URL(currentUrl);
        const baseUrl = `${currentUrlObj.protocol}//${currentUrlObj.host}`;
        return baseUrl + href;
      } else if (!href.startsWith('http')) {
        return new URL(href, currentUrl).href;
      }
      return href;
    }
  }
  
  return null;
}

// Get logs for a specific job
export const getLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;
    
    // Check if the job is still active
    const activeJob = activeJobs.get(jobId);
    if (activeJob) {
      // Get logs from memory
      const logs = activeJob.logs;
      const isRunning = activeJob.isRunning;
      
      return res.status(200).json({
        status: isRunning ? 'running' : 'completed',
        logs
      });
    }
    
    // If not active, get from database
    const job = await Job.findOne({ jobId });
    if (!job) {
      throw new AppError('Job not found', 404);
    }
    
    res.status(200).json({
      status: job.status,
      logs: job.logs,
      error: job.error
    });
  } catch (error) {
    next(error);
  }
};

// Get results for a completed job
export const getResults = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;
    
    // Check if the job is still active
    const activeJob = activeJobs.get(jobId);
    if (activeJob && !activeJob.isRunning) {
      // Get results from memory
      const results = activeJob.results;
      
      return res.status(200).json({
        results
      });
    }
    
    // If not active or still running, get from database
    const job = await Job.findOne({ jobId });
    if (!job) {
      throw new AppError('Job not found', 404);
    }
    
    // Check if job is completed
    if (job.status !== 'completed') {
      throw new AppError(`Job not completed. Current status: ${job.status}`, 400);
    }
    
    res.status(200).json({
      results: job.results
    });
  } catch (error) {
    next(error);
  }
};

// Cancel a running job
export const cancelJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;
    
    // Check if the job is active
    const activeJob = activeJobs.get(jobId);
    if (!activeJob) {
      throw new AppError('Active job not found', 404);
    }
    
    // Cancel the job
    activeJob.isCancelled = true;
    activeJob.isRunning = false;
    activeJob.logs.push('Job cancelled by user');
    
    // Update job status in database
    await Job.findOneAndUpdate(
      { jobId },
      {
        status: 'cancelled',
        logs: activeJob.logs,
        completedAt: new Date()
      }
    );
    
    res.status(200).json({
      message: 'Job cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Check robots.txt compliance for a URL
export const checkRobotsTxt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url } = req.query;
    
    if (!url || typeof url !== 'string') {
      throw new AppError('URL is required', 400);
    }
    
    // Ensure the URL has a protocol
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    
    // Default user agent
    const userAgent = req.query.userAgent as string || 'WebScraper/1.0';
    
    // Check robots.txt compliance
    const result = await validateRobotsTxt(formattedUrl, userAgent);
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

