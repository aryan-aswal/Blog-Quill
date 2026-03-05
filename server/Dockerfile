FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy application code
COPY . .

# Create temp directory for file uploads
RUN mkdir -p /app/temp

EXPOSE 3000

CMD ["node", "server.js"]
