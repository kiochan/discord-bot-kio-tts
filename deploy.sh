#!/bin/bash

APP_NAME="tts-bot"

echo "🔄 Pulling latest code from Git..."
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "🛠️ Building TypeScript..."
npm run build

echo "🚀 Restarting PM2 process..."
pm2 reload $APP_NAME || pm2 start dist/index.js --name $APP_NAME

echo "💾 Saving PM2 process list..."
pm2 save

echo "✅ Deployment complete!"
