# 7HLager - Quick Deploy Script (Windows PowerShell)
# This script helps you deploy the app quickly on Windows

$ErrorActionPreference = "Stop"

Write-Host "🚀 7HLager Deployment Helper" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the frontend directory" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "🔨 Building application..." -ForegroundColor Yellow
npm run build

Write-Host ""
Write-Host "✅ Build complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Choose your deployment option:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1) Deploy to Vercel (Recommended)"
Write-Host "2) Deploy to Netlify"
Write-Host "3) Test locally"
Write-Host "4) Exit"
Write-Host ""
$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
        Write-Host ""

        # Check if vercel is installed
        $vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
        if (-not $vercelInstalled) {
            Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
            npm install -g vercel
        }

        Write-Host "Running Vercel deployment..." -ForegroundColor Yellow
        vercel --prod

        Write-Host ""
        Write-Host "✅ Deployed to Vercel!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📱 Next steps:" -ForegroundColor Cyan
        Write-Host "1. Open the URL shown above in your mobile browser"
        Write-Host "2. iOS: Safari > Share > Add to Home Screen"
        Write-Host "3. Android: Chrome > Menu > Add to Home Screen"
    }

    "2" {
        Write-Host ""
        Write-Host "🚀 Deploying to Netlify..." -ForegroundColor Cyan
        Write-Host ""

        # Check if netlify is installed
        $netlifyInstalled = Get-Command netlify -ErrorAction SilentlyContinue
        if (-not $netlifyInstalled) {
            Write-Host "Installing Netlify CLI..." -ForegroundColor Yellow
            npm install -g netlify-cli
        }

        Write-Host "Running Netlify deployment..." -ForegroundColor Yellow
        netlify deploy --prod --dir=build

        Write-Host ""
        Write-Host "✅ Deployed to Netlify!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📱 Next steps:" -ForegroundColor Cyan
        Write-Host "1. Open the URL shown above in your mobile browser"
        Write-Host "2. iOS: Safari > Share > Add to Home Screen"
        Write-Host "3. Android: Chrome > Menu > Add to Home Screen"
    }

    "3" {
        Write-Host ""
        Write-Host "🖥️  Starting local development server..." -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Access the app at: http://localhost:3000" -ForegroundColor Green
        Write-Host ""
        Write-Host "📱 To test on mobile:" -ForegroundColor Cyan
        Write-Host "1. Find your computer's IP address"
        Write-Host "   - Run: ipconfig"
        Write-Host "   - Look for 'IPv4 Address'"
        Write-Host "2. Open http://YOUR_IP:3000 on your mobile device"
        Write-Host "3. Make sure mobile is on same WiFi network"
        Write-Host ""
        npm run dev
    }

    "4" {
        Write-Host "Goodbye! 👋" -ForegroundColor Cyan
        exit 0
    }

    default {
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 All done!" -ForegroundColor Green
Write-Host ""
Write-Host "📖 For more help, see: DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
