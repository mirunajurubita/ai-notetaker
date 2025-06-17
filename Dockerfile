# Use Node.js official image
FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Install Nest CLI globally (optional, if needed)
RUN npm install -g @nestjs/cli

# Bundle app source
COPY . .

# Expose the app port
EXPOSE 3000

# Run in watch mode
CMD ["npm", "run", "start:dev"]