# Use Node.js official image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build the NestJS app
RUN npm run build

# Expose port (make sure it matches APP_PORT)
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]
