# Use Node.js 20 Alpine as base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies needed for building
RUN apk add --no-cache bash git

# Copy package.json and package-lock.json first (for caching npm install)
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the source code
COPY . ./

# Update browserslist database
RUN npx browserslist@latest --update-db

# Build the app
RUN npm run build

# Expose port
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
