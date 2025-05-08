FROM node:18-alpine WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm ci
# Copy source code
COPY . .
# Build TypeScript
RUN npm run build
# Expose port
EXPOSE 5000
# Start the application
CMD ["node", "dist/index.js"]
