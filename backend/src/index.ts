import app from './app'; import config from 
'./config'; import logger from 
'./config/logger';
// Start the server
const server = app.listen(config.port, () => 
{
  logger.info(`Server started on port 
  ${config.port} (${config.env})`);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => { 
  logger.error('UNHANDLED REJECTION:', err);
  // Graceful shutdown
  server.close(() => { process.exit(1);
  });
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => { 
  logger.error('UNCAUGHT EXCEPTION:', err);
  // Graceful shutdown
  server.close(() => { process.exit(1);
  });
});
