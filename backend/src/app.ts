import express from 'express'; import cors 
from 'cors'; import helmet from 'helmet'; 
import cookieParser from 'cookie-parser'; 
import rateLimit from 'express-rate-limit'; 
import mongoose from 'mongoose'; import 
config from './config'; import logger from 
'./config/logger'; import errorMiddleware 
from './middlewares/error';
// Import routes
import authRoutes from './routes/auth'; 
import configRoutes from './routes/config'; 
import scraperRoutes from './routes/scraper';
// Initialize Express app
const app = express();
// Connect to MongoDB
mongoose.connect(config.mongoUri) .then(() => 
  {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => { logger.error('Failed to 
    connect to MongoDB', { error }); 
    process.exit(1);
  });
// Apply middlewares
app.use(helmet()); app.use(cors({ origin: 
  config.corsOrigin, credentials: true,
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true 
}));
app.use(cookieParser());
// Apply rate limiting
const limiter = rateLimit({ windowMs: 
  config.rateLimitWindow, max: 
  config.rateLimitMax, standardHeaders: true, 
  legacyHeaders: false, message: 'Too many 
  requests from this IP, please try again 
  later.',
});
app.use('/api', limiter);
// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/config', configRoutes); 
app.use('/api/scraper', scraperRoutes);
// Health check route
app.get('/health', (req, res) => { 
  res.status(200).json({ status: 'ok' });
});
// Special route to proxy requests for the 
// visual selector
app.get('/api/proxy', async (req, res) => { 
  const { url } = req.query; if (!url || 
  typeof url !== 'string') {
    return res.status(400).json({ error: 
    'Valid URL is required' });
  }
  
  try { const axios = require('axios'); const 
    response = await axios.get(url, {
      headers: { 'User-Agent': 
        config.defaultUserAgent,
      },
    });
    
    // Inject the selector script
    const html = response.data; const 
    modifiedHtml = html.replace('</body>', `
      <script> 
        document.addEventListener('click', 
        function(e) {
          e.preventDefault();
          
          // Generate a CSS selector for the 
          // clicked element
          let selector = ''; let element = 
          e.target;
          
          while (element && element.tagName) 
          {
            let elementSelector = 
            element.tagName.toLowerCase();
            
            if (element.id) { elementSelector 
              += '#' + element.id; selector = 
              elementSelector + (selector ? ' 
              > ' + selector : '');
              break;
            } else if (element.className) {
              const classes = 
              Array.from(element.classList).join('.'); 
              if (classes) {
                elementSelector += '.' + 
                classes;
              }
            }
            
            // Add position if there are 
            // siblings
            if (!element.id) { const siblings 
              = 
              Array.from(element.parentNode.children).filter(child 
              =>
                child.tagName === 
                element.tagName
              );
              
              if (siblings.length > 1) { 
                const index = 
                siblings.indexOf(element) + 
                1; elementSelector += 
                ':nth-child(' + index + ')';
              }
            }
            
            selector = elementSelector + 
            (selector ? ' > ' + selector : 
            ''); element = 
            element.parentNode;
          }
          
          // Send the selector back to the 
          // parent window
          window.parent.postMessage({ type: 
            'ELEMENT_SELECTED', selector: 
            selector, text: 
            e.target.textContent.trim()
          }, '*');
        }, true);
      </script> </body>`);
    
    res.setHeader('Content-Type', 
    'text/html'); res.send(modifiedHtml);
  } catch (error) {
    logger.error('Error proxying URL', { 
    error, url }); res.status(500).json({ 
    error: 'Failed to proxy the URL' });
  }
});
// Error handler middleware (should be last)
app.use(errorMiddleware); export default app;
