#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Building the application with runtime environment variables..."
npm run build

echo "Starting the application in production mode..."
npm run start -- -p 8080
