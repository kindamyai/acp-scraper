# Web Scraper Application
A powerful web scraping tool inspired by 
Bardeen AI, built using React/Vite for the 
frontend and Node.js for the backend.
## Features
- Multiple extraction methods (Visual, CSS, 
XPath, AI) - Pagination and infinite 
scrolling support - Login handling for 
authenticated sites - Multiple output formats 
(CSV, JSON) - Ethical scraping controls and 
compliance - Real-time progress monitoring - 
Configuration saving and sharing
## Project Structure
- `/frontend`: React/Vite frontend 
application - `/backend`: Node.js/Express 
backend application - `/chrome-extension`: 
Chrome extension code
## Requirements
- Node.js 18+ - MongoDB 5+ - Docker & Docker 
Compose (for deployment)
## Development Setup
### Frontend
```bash cd frontend npm install npm run dev
Backend

cd backend npm install npm run dev 

Chrome Extension

cd chrome-extension npm install npm run build 

Then load the extension in Chrome by navigating to chrome://extensions/, enabling "Developer mode", and clicking "Load unpacked" to select the chrome-extension/dist directory.

Production Deployment

Using Docker Compose:

docker-compose up -d 

License

MIT
With these files, you have a complete, functional web scraper application. The frontend provides an intuitive user interface for configuring and running scrapers, while the backend handles the actual scraping operations using a combination of Axios, Cheerio, and Puppeteer. The Chrome extension allows users to easily start scraping from any webpage.

To use the application:

1. Set up the development environment as described in the README
2. Start both the frontend and backend servers
3. Create an account or log in
4. Configure your first scraper using one of the extraction methods
5. Run the scraper and view the results
6. Export the data in your preferred format

For production use, deploy using Docker Compose as described in the README.

