# 1. Use an official Node.js image as base
FROM node:20

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy all project files
COPY . .

# 5. Expose the port your app runs on (e.g., 3002)
EXPOSE 3002

# 6. Run the app
CMD ["node", "src/server.js"]
