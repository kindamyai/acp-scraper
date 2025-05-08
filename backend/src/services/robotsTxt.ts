import axios from 'axios'; import { URL } 
from 'url'; import robotsParser from 
'robots-txt-parser'; import logger from 
'../config/logger';
// Create robots parser
const robotsCache = robotsParser({ 
  allowOnNeutral: true, // Allow crawling 
  when there are no rules for the bot 
  userAgent: 'WebScraper', // Default user 
  agent
});
interface RobotsTxtResult { allowed: boolean; 
  reason?: string;
}
// Validate if scraping is allowed according 
// to robots.txt
export const validateRobotsTxt = async (url: 
string, userAgent: string): 
Promise<RobotsTxtResult> => {
  try { const urlObj = new URL(url); const 
    hostname = urlObj.hostname; const path = 
    urlObj.pathname + urlObj.search;
    
    // Set the user agent for the parser
    robotsCache.setUserAgent(userAgent);
    
    // Get the robots.txt content
    try { await 
      robotsCache.useRobotsFor(`${urlObj.protocol}//${hostname}`);
    } catch (error) {
      logger.warn(`Error fetching robots.txt 
      for ${hostname}`, { error });
      // If we can't fetch robots.txt, we'll 
      // be permissive
      return { allowed: true, reason: 'Could 
      not fetch robots.txt, assuming crawling 
      is allowed' };
    }
    
    // Check if the path is allowed
    const isAllowed = await 
    robotsCache.canCrawl(url);
    
    if (!isAllowed) { return { allowed: 
        false, reason: `Path "${path}" is 
        disallowed in robots.txt`
      };
    }
    
    // Check crawl delay
    const crawlDelay = await 
    robotsCache.getCrawlDelay(); if 
    (crawlDelay && crawlDelay > 0) {
      logger.info(`Robots.txt recommends a 
      crawl delay of ${crawlDelay}ms`);
    }
    
    return { allowed: true };
  } catch (error) {
    logger.error('Error processing 
    robots.txt', { error, url });
    // In case of any error, we'll be 
    // permissive
    return { allowed: true, reason: 'Error 
    processing robots.txt, assuming crawling 
    is allowed' };
  }
};
