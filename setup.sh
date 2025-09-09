#!/bin/bash

# Starboard Write - Setup Script
echo "🚀 Setting up Starboard Write MVP..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Setup backend
echo "📦 Installing backend dependencies..."
cd server
npm install

if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit server/.env file with your MongoDB URI and other configuration"
fi

cd ..

# Setup frontend
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Edit server/.env file with your configuration"
echo "2. Make sure MongoDB is running"
echo "3. Start the backend: cd server && npm run dev"
echo "4. Start the frontend: cd client && npm start"
echo "5. Visit http://localhost:3000 to use the application"
echo ""
echo "📚 See README.md for detailed instructions"
