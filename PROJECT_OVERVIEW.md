# Project Overview: Web Scraper Application

## 1. Project Purpose

The project is a web scraper application inspired by Bardeen AI. It allows users to extract data from websites using various methods like Visual, CSS, XPath, and AI. Key features include handling pagination and infinite scrolling, supporting login for authenticated sites, offering multiple output formats (CSV, JSON), providing ethical scraping controls, real-time progress monitoring, and enabling configuration saving and sharing. The application consists of a React/Vite frontend, a Node.js/Express backend, and a Chrome extension.

## 2. Project Architecture

The web scraper application has a three-tier architecture: a frontend, a backend, and a Chrome extension.

### Frontend
*   **Description:** Provides the user interface for configuring and running scrapers, viewing results, and managing user accounts.
*   **Technologies:**
    *   **Framework/Library:** React (using Vite for build tooling)
    *   **Language:** TypeScript
    *   **Styling:** Tailwind CSS (with PostCSS and Autoprefixer)
    *   **State Management:** Zustand
    *   **Data Fetching/Caching:** React Query
    *   **Routing:** React Router DOM
    *   **HTTP Client:** Axios
    *   **Web Server (for serving static files in production):** Nginx (inferred from `nginx.conf` and `Dockerfile`)
    *   **Build Tool:** Vite
    *   **Testing:** Vitest (with React Testing Library)

### Backend
*   **Description:** Handles the core scraping operations, user authentication, data storage, and API services for the frontend and Chrome extension.
*   **Technologies:**
    *   **Runtime Environment:** Node.js
    *   **Framework:** Express.js
    *   **Language:** TypeScript
    *   **Database:** MongoDB (using Mongoose as ODM)
    *   **Containerization:** Docker
    *   **Scraping Libraries:**
        *   Puppeteer (for headless browser automation)
        *   Cheerio (for server-side DOM manipulation)
        *   Axios (for making HTTP requests)
    *   **Authentication:** JSON Web Tokens (JWT) using `jsonwebtoken`, password hashing with `bcrypt`
    *   **API & Communication:**
        *   RESTful APIs (standard with Express)
        *   `cors` for Cross-Origin Resource Sharing
    *   **Security:** `helmet` for security headers, `express-rate-limit` for rate limiting
    *   **Logging:** Winston
    *   **Environment Variables:** `dotenv`
    *   **Data Formatting:** `csv-stringify` (for CSV output)
    *   **Robots.txt Parsing:** `robots-txt-parser`
    *   **XPath Parsing:** `xpath`
    *   **Development:** `nodemon` for auto-reloading, `ts-node` for running TypeScript directly
    *   **Testing:** Jest (with Supertest for API testing, `mongodb-memory-server` for in-memory DB testing)

### Chrome Extension
*   **Description:** Allows users to initiate scraping tasks directly from web pages they are visiting.
*   **Technologies:**
    *   **Language:** TypeScript
    *   **Bundler:** Webpack
    *   **Core Components:**
        *   `manifest.json` (extension configuration)
        *   Background Scripts (`background.ts`)
        *   Content Scripts (`content.ts`)
        *   Popup UI (`popup.html`, `popup.css`, `popup.ts`)

## 3. Development Setup

**Prerequisites:**
*   Node.js 18+
*   MongoDB 5+

**1. Frontend Setup:**
*   Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
*   Install dependencies:
    ```bash
    npm install
    ```
*   Run the development server:
    ```bash
    npm run dev
    ```

**2. Backend Setup:**
*   Navigate to the backend directory:
    ```bash
    cd backend
    ```
*   Install dependencies:
    ```bash
    npm install
    ```
*   Run the development server:
    ```bash
    npm run dev
    ```
    *(Note: Ensure your MongoDB instance is running and accessible.)*

**3. Chrome Extension Setup:**
*   Navigate to the Chrome extension directory:
    ```bash
    cd chrome-extension
    ```
*   Install dependencies:
    ```bash
    npm install
    ```
*   Build the extension:
    ```bash
    npm run build
    ```
*   Load the extension in Chrome:
    1.  Open Chrome and navigate to `chrome://extensions/`.
    2.  Enable "Developer mode".
    3.  Click "Load unpacked".
    4.  Select the `chrome-extension/dist` directory.

## 4. How to Use the Application

1.  **Setup and Initial Steps:**
    *   Set up the development environment as detailed above.
    *   Start both the frontend and backend servers.
2.  **Authentication:**
    *   Create an account or log in to the application.
3.  **Scraper Configuration:**
    *   Configure your scraper, choosing an extraction method (e.g., Visual, CSS, XPath, AI).
4.  **Running the Scraper:**
    *   Run the configured scraper. The Chrome extension can also be used to initiate scraping from web pages.
5.  **Viewing Results:**
    *   View the results of the scraping process. Real-time progress monitoring is available.
6.  **Exporting Data:**
    *   Export the collected data in CSV or JSON format.

## 5. Production Deployment

The application is deployed to a production environment using Docker Compose.

*   **Prerequisites:**
    *   Docker and Docker Compose installed on the production server.
    *   A MongoDB instance (version 5+) accessible to the backend service.
*   **Deployment Command:**
    ```bash
    docker-compose up -d
    ```
    This command starts the services defined in the `docker-compose.yml` file in detached mode.
