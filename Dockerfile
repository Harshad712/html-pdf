# Use node base image
FROM node:20

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install express puppeteer uuid body-parser

# Bundle app source
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
