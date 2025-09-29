#!/bin/bash

# Build script for Maily with Node.js backend (PHP-compatible API)

echo "🚀 Building Maily with Node.js Backend (PHP-compatible API)..."

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Build React frontend
echo "⚛️  Building React frontend..."
cd ../apps/web
npm install
npm run build

# Create dist directory in backend
echo "📁 Setting up backend..."
cd ../../php-api
mkdir -p dist

# Copy built React app to backend
echo "📋 Copying built files..."
cp -r ../apps/web/build/* dist/

echo "✅ Build complete!"
echo ""
echo "To start the server:"
echo "  cd php-api"
echo "  npm start"
echo ""
echo "The Maily editor will be available at: http://localhost:8001"
echo ""
echo "This Node.js backend provides the same API endpoints as PHP would:"
echo "  - POST /api/v1/templates (create template)"
echo "  - POST /api/v1/templates/{id} (update template)"
echo "  - DELETE /api/v1/templates/{id} (delete template)"
echo "  - POST /api/v1/templates/{id}/duplicate (duplicate template)"
echo "  - POST /api/v1/emails/preview (preview email)"
echo "  - GET /api/auth/callback (OAuth callback)"
echo "  - GET /api/auth/confirm (email confirmation)"
echo "  - POST /api/auth/logout (logout)"