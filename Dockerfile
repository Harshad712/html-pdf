# Use Node.js base image
FROM node:20

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies from package.json
RUN npm install

# Optional: Skip Puppeteer Chromium download during build
# (if you download it later at runtime instead)
# ENV PUPPETEER_SKIP_DOWNLOAD=true

# Copy the rest of the app source code
COPY . .

# Expose the app's port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
