# Use the official Node.js 14 image as the base image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose a port (replace 3000 with your application's port)
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]