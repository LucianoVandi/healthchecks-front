# Base Stage: Node.js base image
FROM node:18-alpine AS base

# Declare ARGs for build-time values
ARG NEXT_PUBLIC_APIKEY
ARG NEXT_PUBLIC_BACKEND_URL

# Set ENV variables from ARG values
ENV NEXT_PUBLIC_APIKEY=$NEXT_PUBLIC_APIKEY
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

# Set the working directory
WORKDIR /app

# Copy necessary files
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Set the variable for OpenSSL legacy
ENV NODE_OPTIONS=--openssl-legacy-provider

# Development Stage
FROM base AS development
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

# Build Stage
FROM base AS builder
ENV NODE_ENV=production
RUN npm run build

# Production Runtime Stage (lightweight image)
FROM node:18-alpine AS production
WORKDIR /app

# Copy the build and necessary files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Remove unnecessary files to reduce image size
RUN npm prune --production

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
