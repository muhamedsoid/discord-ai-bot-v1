# Use Node.js 22 as the base image
FROM node:22-slim

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm build

# Set environment to production
ENV NODE_ENV=production

# Expose the port (Hugging Face uses 7860 by default)
EXPOSE 7860
ENV PORT=7860

# Start the application
CMD ["pnpm", "start"]
