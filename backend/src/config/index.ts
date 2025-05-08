import dotenv from 'dotenv'; import path from 
'path';
// Load environment variables
dotenv.config({ path: path.join(__dirname, 
'../../.env') }); interface Config {
  env: string; port: number; mongoUri: 
  string; jwtSecret: string; jwtExpiresIn: 
  string; rateLimitWindow: number; 
  rateLimitMax: number; corsOrigin: string | 
  string[]; defaultUserAgent: string; 
  maxConcurrentJobs: number; resultsTtl: 
  number; // Time to live for results in 
  seconds
}
const config: Config = { env: 
  process.env.NODE_ENV || 'development', 
  port: parseInt(process.env.PORT || '5000', 
  10), mongoUri: process.env.MONGO_URI || 
  'mongodb://localhost:27017/webscraper', 
  jwtSecret: process.env.JWT_SECRET || 
  'your-secret-key', jwtExpiresIn: 
  process.env.JWT_EXPIRES_IN || '1d', 
  rateLimitWindow: 
  parseInt(process.env.RATE_LIMIT_WINDOW || 
  '15', 10) * 60 * 1000, // 15 minutes in ms 
  rateLimitMax: 
  parseInt(process.env.RATE_LIMIT_MAX || 
  '100', 10), corsOrigin: 
  process.env.CORS_ORIGIN ? 
  process.env.CORS_ORIGIN.split(',') : '*', 
  defaultUserAgent: 'WebScraper/1.0 
  (+https://yourwebsite.com/bot)', 
  maxConcurrentJobs: 
  parseInt(process.env.MAX_CONCURRENT_JOBS || 
  '5', 10), resultsTtl: 
  parseInt(process.env.RESULTS_TTL || 
  '86400', 10), // 24 hours by default
};
export default config;
