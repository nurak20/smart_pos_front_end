# Use standard Node.js image instead of Alpine
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the port the app will run on (matching vite config)
EXPOSE 3000

# Start the app with host flag for Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
