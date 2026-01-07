# 7HLager - Tire Inventory Management System

Professional tire inventory management system built with React and base44.com backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- base44.com account with API access

### Installation

1. **Clone and install dependencies**
```bash
cd frontend
npm install
```

2. **Configure environment**
```bash
# Copy the example env file
cp .env.example .env

# The .env file is already configured with:
# - Base44 API Key: af4ff83bf4ef4e13beaf80f03873e8b1
# - Base44 App ID: 695d0c9f78f4807eec0ee22e
```

3. **Run the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── apiClient.js          # Base44 API client
│   ├── components/
│   │   ├── ui/                   # Shadcn UI components
│   │   ├── LanguageContext.jsx  # i18n support
│   │   ├── Layout.jsx            # Main layout with sidebar
│   │   ├── PositionSelector.jsx # Warehouse position picker
│   │   └── QRCodeGenerator.jsx  # QR code generation
│   ├── pages/
│   │   ├── Dashboard.jsx         # Dashboard with stats
│   │   ├── Inventory.jsx         # Tire inventory management
│   │   ├── TireSets.jsx          # Tire set management
│   │   ├── Customers.jsx         # Customer management
│   │   ├── TireHotel.jsx         # Customer tire storage
│   │   ├── Sales.jsx             # Sales orders
│   │   └── Settings.jsx          # System settings
│   ├── schemas/                  # Data model documentation
│   ├── lib/
│   │   └── utils.js              # Utility functions
│   └── App.jsx                   # Main app component
├── .env                          # Environment configuration
└── package.json
```

## 📦 Features

### ✅ Completed Features
- **Dashboard**: Overview with stats and recent activity
- **Inventory Management**: Full CRUD for tires with 4-way filtering
- **Tire Sets**: Set management with profit tracking
- **Customers**: Customer management with contact info
- **QR Code Generation**: Generate and print QR codes for items
- **Multi-language**: Swedish/English support
- **Modern UI**: Shadcn UI components with Tailwind CSS
- **Real-time Data**: React Query with caching

### 🚧 Ready for Implementation
- **Tire Hotel**: Customer tire storage (schema ready)
- **Sales Orders**: Order creation and invoicing (schema ready)
- **Settings**: Enhanced system configuration

## 🔑 Base44 Integration

### API Client
The app connects directly to base44.com at:
```
https://app.base44.com/api/apps/695d0c9f78f4807eec0ee22e
```

### Entities
All entities are configured in base44.com:
- `Tire` - Individual tire inventory
- `TireSet` - Tire sets for sale
- `Customer` - Customer records
- `CustomerTireSet` - Tire hotel storage
- `SalesOrder` - Sales orders
- `WarehousePosition` - Warehouse locations
- `SystemSettings` - System configuration

### Authentication
Uses API key authentication with the `api_key` header.

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server (port 5173)

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## 📊 Data Models

All data schemas are documented in `src/schemas/`:
- `tire.schema.json`
- `tireset.schema.json`
- `customer.schema.json`
- `customer-tireset.schema.json`
- `sales-order.schema.json`
- `warehouse-position.schema.json`
- `system-settings.schema.json`

## 🌍 Internationalization

The app supports Swedish and English. Toggle between languages using the sidebar dropdown.

Translation keys are in `src/components/LanguageContext.jsx`.

## 🎨 UI Components

Built with:
- **Shadcn UI**: High-quality React components
- **Radix UI**: Accessible primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Modern icon set
- **React Query**: Data fetching and caching
- **Sonner**: Beautiful toast notifications

## 📝 License

Proprietary - Sjuhärads Biluthyrning & Transport AB

## 🏢 Company

**Sjuhärads Biluthyrning & Transport AB**
7HLager Inventory Management System
Version 1.0.0
