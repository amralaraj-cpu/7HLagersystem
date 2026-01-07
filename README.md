# 7HLager - Tire & Wheel Inventory Management System

Complete business management system for tire/wheel sales inventory, customer tire storage (tire hotel), sales tracking, invoicing, and warehouse location management.

## Company
**Sjuhärads Biluthyrning & Transport AB**
Location: Borås, Sweden

## Features

### Core Functionality
- **User Authentication**: Email-based registration, login, password reset
- **Warehouse Location System**: A-N-U-P format (18,200 positions)
- **Inventory Management**: Tires, wheels, and complete wheels
- **Flexible SET System**: Group tires in sets of any quantity
- **Tire Hotel**: Customer seasonal tire storage with C- prefix locations
- **Sales & Invoicing**: Complete sales order system with Swedish-compliant invoicing
- **QR Code System**: Generate and scan QR codes for inventory tracking
- **Dashboard & Analytics**: Real-time insights and reporting
- **Mobile Responsive**: PWA with offline capabilities
- **Bilingual**: Swedish (primary) and English (secondary)

### User Roles
- **Administrator**: Full access to all features
- **User**: View inventory, manage tire hotel check-in/out

## Technology Stack

### Frontend
- React.js 18+
- Tailwind CSS
- Chart.js for analytics
- html5-qrcode for scanning
- qrcode for generation
- React Router for navigation
- Axios for API calls

### Backend
- Node.js 18+
- Express.js
- PostgreSQL database
- JWT authentication
- Bcrypt for password hashing
- Nodemailer for emails

### Infrastructure
- Progressive Web App (PWA)
- Service Worker for offline mode
- RESTful API architecture

## Project Structure

```
7HLagersystem/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Entry point
│   ├── database/           # Database migrations and seeds
│   └── package.json
├── frontend/               # React frontend
│   ├── public/
│   │   ├── icons/         # PWA icons
│   │   └── manifest.json  # PWA manifest
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # React context
│   │   ├── utils/         # Utility functions
│   │   ├── i18n/          # Translations
│   │   └── App.jsx        # Main app component
│   ├── tailwind.config.js
│   └── package.json
└── README.md

## Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run migrate
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm start
```

## Environment Variables

### Backend (.env)
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/7hlager
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-password
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Database Schema

The system uses PostgreSQL with the following main tables:
- users
- warehouse_locations
- inventory_items
- sets
- customers
- tire_hotel_storage
- sales_orders
- invoices
- audit_logs

## API Documentation

API endpoints are organized into:
- `/api/auth` - Authentication
- `/api/inventory` - Inventory management
- `/api/sets` - SET operations
- `/api/tire-hotel` - Tire hotel management
- `/api/sales` - Sales and invoicing
- `/api/locations` - Warehouse locations
- `/api/qr` - QR code operations
- `/api/reports` - Analytics and reports

## Warehouse Location Format

### Sales Inventory
Format: **A-N-U-P**
- A = Aisle (A-Z)
- N = Level (01-10)
- U = Unit (01-10)
- P = Position (1-7)

Example: `A-03-05-4`

### Customer Storage (Tire Hotel)
Format: **C-A-N-U-P**

Example: `C-A-03-05-4`

**Total Capacity**: 18,200 positions (one tire per position)

## Development

### Run Backend
```bash
cd backend
npm run dev
```

### Run Frontend
```bash
cd frontend
npm start
```

### Run Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Deployment

### 🌐 Deploy Online (Free)

The easiest way to test the application is to deploy it online:

**📘 Render.com (Recommended):** See [DEPLOY_TO_RENDER.md](./DEPLOY_TO_RENDER.md)
- Free PostgreSQL included
- 10-minute setup
- SSL certificate included

**📗 Railway.app (Fastest):** See [DEPLOY_QUICK_GUIDE.md](./DEPLOY_QUICK_GUIDE.md)
- Auto-detects configuration
- 5-minute setup
- $5/month free credit

**🎯 Quick Comparison:** [DEPLOY_QUICK_GUIDE.md](./DEPLOY_QUICK_GUIDE.md)

### Production Build (Self-Hosted)
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

## Support

For questions or support:
- Email: support@sjuharads.se
- Phone: Swedish support hours

## License

Proprietary - Sjuhärads Biluthyrning & Transport AB

## Version

1.0.0 - Initial Release
