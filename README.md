# 🚗 7HLager - Tire Inventory Management System

Professional inventory and warehouse management system for tire storage, sales, and customer service.

Built for **Sjuhärads Biluthyrning & Transport AB**

---

## ✨ Features

- 📦 **Inventory Management** - Track tires with full details (brand, size, season, condition)
- 🔧 **Tire Sets** - Manage complete 4-tire sets with profit tracking
- 🏨 **Tire Hotel** - Customer tire storage with automatic fee calculation
- 👥 **Customer Database** - Track customers and their vehicles
- 💰 **Sales Orders** - Complete order management with VAT calculation
- 📊 **Dashboard** - Real-time statistics and insights
- ⚙️ **Settings** - Configurable business rules and preferences
- 📱 **Mobile Ready** - Install on phone/tablet as native app
- 🌐 **Multi-language** - Swedish and English support
- 📴 **Offline Ready** - Works without internet after initial load
- 🔒 **Secure** - base44.com backend with API key authentication

---

## 🚀 Quick Start (3 Minutes)

### For Windows:
```powershell
cd frontend
.\deploy.ps1
```

### For Mac/Linux:
```bash
cd frontend
./deploy.sh
```

Follow the prompts to:
1. Build the app
2. Deploy to Vercel or Netlify
3. Get your live URL
4. Install on mobile!

---

## 📱 Install on Mobile

### iPhone/iPad:
1. Open URL in **Safari**
2. Tap **Share** button
3. Tap **"Add to Home Screen"**
4. Done! App icon appears on home screen

### Android:
1. Open URL in **Chrome**
2. Tap **Menu** (⋮)
3. Tap **"Add to Home screen"**
4. Done! App icon appears on home screen

---

## 💻 Development

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- npm or yarn

### Local Setup

```bash
# 1. Clone repository
git clone <your-repo-url>
cd 7HLagersystem/frontend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your settings

# 4. Start development server
npm run dev

# 5. Open browser
# http://localhost:3000
```

### Build for Production

```bash
npm run build
```

Output will be in the `build/` directory.

---

## 🌐 Deployment

### Option 1: Vercel (Fastest - Recommended)

```bash
npm install -g vercel
cd frontend
vercel --prod
```

### Option 2: Netlify

```bash
npm install -g netlify-cli
cd frontend
npm run build
netlify deploy --prod --dir=build
```

### Option 3: Use Deploy Scripts

**Windows**: `cd frontend && .\deploy.ps1`
**Mac/Linux**: `cd frontend && ./deploy.sh`

📖 **Full deployment guide**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 🎯 Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **React Query v5** - Data fetching & caching
- **React Router v6** - Client-side routing
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **QRCode** - QR code generation

### Backend
- **base44.com** - Cloud database & API
- Direct REST API integration
- Real-time data synchronization

### UI Components
- **Shadcn UI** - Component library
- **Radix UI** - Primitives
- Custom components for inventory management

---

## 📂 Project Structure

```
7HLagersystem/
├── frontend/
│   ├── public/              # Static assets
│   │   ├── manifest.json   # PWA manifest
│   │   ├── sw.js          # Service worker
│   │   └── icon.svg       # App icon
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # React components
│   │   │   ├── ui/       # Shadcn UI components
│   │   │   └── ...       # Custom components
│   │   ├── pages/         # Page components
│   │   ├── lib/          # Utilities
│   │   ├── schemas/       # Data schemas
│   │   └── main.jsx      # Entry point
│   ├── deploy.sh          # Deploy script (Mac/Linux)
│   ├── deploy.ps1         # Deploy script (Windows)
│   └── package.json       # Dependencies
├── DEPLOYMENT_GUIDE.md     # Full deployment instructions
└── README.md              # This file
```

---

## 🔑 Environment Variables

Required in `frontend/.env`:

```env
# Base44.com Configuration
VITE_BASE44_API_KEY=your_api_key_here
VITE_BASE44_APP_ID=695d0c9f78f4807eec0ee22e

# Application Info
VITE_APP_NAME=7HLager
VITE_COMPANY_NAME=Sjuhärads Biluthyrning & Transport AB
```

---

## 📖 User Guide

### Login
- Use base44.com API key
- Development key shown on login page

### Main Features

**📊 Dashboard**
- View inventory statistics
- See recent activity
- Quick insights

**📦 Inventory**
- Add/edit/delete tires
- Filter by brand, size, season, condition
- Generate QR codes
- Track pricing and profit

**🔧 Tire Sets**
- Manage 4-tire sets
- Automatic profit calculation
- Link to individual tires
- Set pricing

**🏨 Tire Hotel**
- Check-in/check-out customer tires
- Auto-calculate storage fees
- Track positions (C-01, C-02, etc.)
- Customer tire management

**👥 Customers**
- Manage customer database
- Track vehicles (registration, brand/model)
- Store contact details
- View purchase history

**💰 Sales**
- Create sales orders
- Multi-item orders
- Automatic VAT calculation (25% default)
- Payment status tracking
- Order workflow management

**⚙️ Settings**
- Configure storage fees
- Set VAT rates
- Manage notification preferences
- System configuration

---

## 🔧 Customization

### Change Brand Color

Edit `frontend/tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: '#2563eb', // Your color
    }
  }
}
```

### Change App Name

Update `frontend/.env`:
```env
VITE_APP_NAME=Your App Name
```

Update `frontend/public/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "YourApp"
}
```

### Add Your Logo

Replace `frontend/public/icon.svg` with your logo and regenerate icons.

---

## 📱 Progressive Web App (PWA)

The app is a full PWA with:
- ✅ **Installable** on all devices
- ✅ **Offline capable** with service worker
- ✅ **Fast loading** with caching
- ✅ **Native feel** in standalone mode
- ✅ **Background sync** support
- ✅ **Push notifications** support

---

## 🐛 Troubleshooting

### Build Errors
```bash
# Clean install
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### App Won't Install on Mobile
- **iOS**: Must use Safari browser
- **Android**: Must use Chrome browser
- Requires HTTPS (automatic on Vercel/Netlify)

### API Errors
- Check API key is correct
- Verify base44.com is accessible
- Check browser console for details

### Local Development
```bash
cd frontend
npm run dev
```

Access at `http://localhost:3000`

---

## 📊 Performance

- **Bundle Size**: ~530KB (156KB gzipped)
- **First Load**: <3s on 3G
- **Cached Load**: <1s
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)

---

## 🔒 Security

- ✅ HTTPS enforced
- ✅ API key authentication
- ✅ XSS protection headers
- ✅ CSRF protection
- ✅ Content Security Policy
- ✅ No sensitive data in localStorage
- ✅ Secure service worker implementation

---

## 🗂️ Data Models

### Tire
- Brand, model, dimension, season
- DOT, condition, tread depth
- Purchase/sale price, profit tracking
- Warehouse position
- QR code

### TireSet
- Set ID, quantity (usually 4)
- Total purchase/sale price
- Profit calculation
- Linked tire IDs

### Customer
- Name, email, phone, address
- Vehicle registration, brand/model
- Purchase history

### CustomerTireSet
- Customer tire storage
- Check-in/check-out dates
- Storage fees
- Position tracking

### SalesOrder
- Order number, customer
- Multiple line items
- VAT calculation
- Payment tracking
- Order status workflow

### SystemSettings
- Configurable key-value pairs
- Type-aware (string, number, boolean, JSON)
- Business rules and preferences

---

## 📄 License

Proprietary - Sjuhärads Biluthyrning & Transport AB

---

## 🤝 Support

For issues or questions:
1. Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
2. Review browser console errors
3. Verify environment variables
4. Check base44.com API status

---

## 🎉 Ready to Go!

Your complete tire inventory system is ready to use on:
- 💻 Laptops
- 📱 Phones
- 📱 Tablets

**Deploy in 3 minutes** → **Use anywhere!**

---

## Company

**Sjuhärads Biluthyrning & Transport AB**
Location: Borås, Sweden

---

Made with ❤️ for professional tire management
