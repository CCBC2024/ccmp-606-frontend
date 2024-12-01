# Stage 1: Build dependencies
FROM node:22 AS builder

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application source code
COPY . .

# Stage 2: Final image with the application
FROM node:22-slim

# Set the working directory
WORKDIR /app

# Copy the build output and source code from the builder stage
COPY --from=builder /app /app

# Copy the custom start script
COPY start.sh /app/start.sh

# Make the script executable
RUN chmod +x /app/start.sh

# Expose the port the app will run on
EXPOSE 8080

# Use the custom start script as the entrypoint
CMD ["/app/start.sh"]
