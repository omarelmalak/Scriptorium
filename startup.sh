#!/bin/bash

# GENAI Citation: Used to setup startup script to initialize prisma, running dev, installing dependencies, 
# env file verification, running docker compose. 

# Check if .env file exists, and create one if it doesn't

echo "Stopping and removing existing containers..."
docker compose down -v

echo "Building and starting containers..."
docker compose up --build -d

if [ ! -f .env ]; then
  echo "Creating .env file..."
  echo "JWT_ACCESS_SECRET=omarandlaith" >> .env
  echo "JWT_REFRESH_SECRET=omarandlaith" >> .env
fi

export $(grep -v '^#' .env | xargs)

if [ -z "$JWT_ACCESS_SECRET" ] || [ -z "$JWT_REFRESH_SECRET" ]; then
  echo "Error: JWT_ACCESS_SECRET or JWT_REFRESH_SECRET is missing in .env."
  exit 1
fi

echo "Starting app locally..."
npm run dev &

echo "Waiting for app to initialize..."
sleep 10

echo "Initializing Prisma migrations locally..."
npx prisma migrate deploy

echo "Generating Prisma client locally..."
npx prisma generate

echo "Initializing admin user locally..."
node ./createAdmin.js

echo "Setup complete."
