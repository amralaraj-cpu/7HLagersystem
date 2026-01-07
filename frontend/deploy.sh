#!/bin/bash

# 7HLager - Quick Deploy Script
# This script helps you deploy the app quickly

set -e  # Exit on error

echo "🚀 7HLager Deployment Helper"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building application..."
npm run build

echo ""
echo "✅ Build complete!"
echo ""
echo "📱 Choose your deployment option:"
echo ""
echo "1) Deploy to Vercel (Recommended)"
echo "2) Deploy to Netlify"
echo "3) Test locally"
echo "4) Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying to Vercel..."
        echo ""

        # Check if vercel is installed
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi

        echo "Running Vercel deployment..."
        vercel --prod

        echo ""
        echo "✅ Deployed to Vercel!"
        echo ""
        echo "📱 Next steps:"
        echo "1. Open the URL shown above in your mobile browser"
        echo "2. iOS: Safari > Share > Add to Home Screen"
        echo "3. Android: Chrome > Menu > Add to Home Screen"
        ;;

    2)
        echo ""
        echo "🚀 Deploying to Netlify..."
        echo ""

        # Check if netlify is installed
        if ! command -v netlify &> /dev/null; then
            echo "Installing Netlify CLI..."
            npm install -g netlify-cli
        fi

        echo "Running Netlify deployment..."
        netlify deploy --prod --dir=build

        echo ""
        echo "✅ Deployed to Netlify!"
        echo ""
        echo "📱 Next steps:"
        echo "1. Open the URL shown above in your mobile browser"
        echo "2. iOS: Safari > Share > Add to Home Screen"
        echo "3. Android: Chrome > Menu > Add to Home Screen"
        ;;

    3)
        echo ""
        echo "🖥️  Starting local development server..."
        echo ""
        echo "Access the app at: http://localhost:3000"
        echo ""
        echo "📱 To test on mobile:"
        echo "1. Find your computer's IP address"
        echo "   - Mac/Linux: ifconfig | grep 'inet '"
        echo "   - Windows: ipconfig"
        echo "2. Open http://YOUR_IP:3000 on your mobile device"
        echo "3. Make sure mobile is on same WiFi network"
        echo ""
        npm run dev
        ;;

    4)
        echo "Goodbye! 👋"
        exit 0
        ;;

    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 All done!"
echo ""
echo "📖 For more help, see: DEPLOYMENT_GUIDE.md"
