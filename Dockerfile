# Stage 1: Build the frontend
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app and build
COPY . .
RUN npm run build

EXPOSE 5173
CMD ["npm", "run", "preview"]
