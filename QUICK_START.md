# 🚀 7HLager - Quick Start Guide

## ✅ Application is Running!

Your 7HLager inventory management system is now running and ready to test!

---

## 🌐 Access the Application

### Frontend (User Interface)
**URL:** http://localhost:3000

Click the link above or open it in your browser to access the application.

### Backend API
**URL:** http://localhost:5000/api
**Health Check:** http://localhost:5000/health

---

## 🔐 Login Credentials

### Administrator Account (Full Access)
- **Email:** `admin@sjuharads.se`
- **Password:** `Admin123!`
- **Can:** Add/edit/delete inventory, create sales, manage users, access all features

### Regular User Account (Limited Access)
- **Email:** `user@sjuharads.se`
- **Password:** `User123!`
- **Can:** View inventory, manage tire hotel check-in/out

---

## 📊 What You Can Test

### Dashboard
- View warehouse statistics (36,400 total positions)
- See sales inventory vs customer storage breakdown
- Check occupancy rates

### Inventory Management
- Browse inventory items
- Search by brand, dimension, location code
- **Admin only:** Add new inventory items
- View item details

### Warehouse Locations
- 18,200 sales inventory positions (A-N-U-P format)
- 18,200 customer storage positions (C-A-N-U-P format)
- Location validation and availability checking

---

## 📝 Test Scenarios

### 1. Login as Administrator
```
1. Go to http://localhost:3000
2. Login with: admin@sjuharads.se / Admin123!
3. View the dashboard
4. Navigate to "Lager" (Inventory)
5. Try searching for items
```

### 2. View Warehouse Statistics
```
1. Check dashboard for:
   - Total capacity: 36,400 positions
   - Current occupancy
   - Sales vs Customer storage split
```

### 3. Test User Roles
```
1. Login as admin - see "Försäljning" and "Däckhotell" links
2. Logout
3. Login as user@sjuharads.se - limited menu options
```

---

## 🛠️ Control the Application

### View Server Logs
```bash
# Backend logs
tail -f backend.log

# Frontend logs
tail -f frontend.log

# Both together
tail -f backend.log frontend.log
```

### Stop the Servers
```bash
killall node
```

### Restart the Servers
```bash
bash start.sh
```

### Reset Database
```bash
cd backend
node database/migrate.js
node database/seed.js
```

---

## 📁 Database Information

**Database:** `hlager`
**User:** `hlager_user`
**Password:** `hlager123`
**Host:** `localhost:5432`

**Tables Created:**
- `users` (2 demo users)
- `warehouse_locations` (36,400 positions)
- `inventory_items` (empty - ready for testing)
- `sets`, `customers`, `tire_hotel_storage`
- `sales_orders`, `invoices`, `audit_logs`

---

## 🎯 Next Steps

The application is running with core features:
- ✅ User authentication
- ✅ Dashboard with statistics
- ✅ Warehouse location system
- ✅ Basic inventory management
- ✅ Role-based access control

**Ready for Phase 2 features:**
- SET system (group tires together)
- Customer database & tire hotel
- Sales orders & invoicing
- QR code generation/scanning
- Advanced search & filtering
- Multi-language support

---

## ⚙️ Environment

**Backend:** Node.js + Express.js + PostgreSQL
**Frontend:** React 18 + Vite + Tailwind CSS
**Database:** PostgreSQL 16

**Ports:**
- Frontend: 3000
- Backend: 5000
- Database: 5432

---

## 🆘 Troubleshooting

### Application not loading?
```bash
# Check if servers are running
ps aux | grep node

# Check logs for errors
cat backend.log frontend.log
```

### Database connection error?
```bash
# Restart PostgreSQL
service postgresql restart

# Re-run migration
cd backend && node database/migrate.js
```

### Port already in use?
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9

# Restart
bash start.sh
```

---

## 📧 Support

For questions or issues:
- Check logs: `backend.log` and `frontend.log`
- Review README.md for detailed setup
- Check GitHub repository for documentation

---

**Happy Testing! 🎉**

The 7HLager inventory management system is ready for you to explore!
