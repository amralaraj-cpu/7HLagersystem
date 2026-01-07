# 🚀 Deploy 7HLager to Render.com

This guide will help you deploy the 7HLager application online for **FREE** using Render.com.

---

## 📋 Prerequisites

1. A **GitHub account** (you already have the repo!)
2. A **Render.com account** (free - sign up at https://render.com)
3. **10 minutes** of your time

---

## 🎯 Deployment Steps

### **Step 1: Sign Up for Render.com**

1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with your **GitHub account** (easiest option)
4. Authorize Render to access your repositories

---

### **Step 2: Create PostgreSQL Database**

1. From Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Fill in:
   - **Name:** `7hlager-db`
   - **Database:** `hlager`
   - **User:** `hlager_user`
   - **Region:** Choose closest to you (e.g., Frankfurt, Oregon)
   - **Plan:** **Free** ✅
3. Click **"Create Database"**
4. Wait 2-3 minutes for it to provision
5. **Copy the "Internal Database URL"** (you'll need this!)

---

### **Step 3: Deploy Backend API**

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `7HLagersystem`
3. Configure:
   - **Name:** `7hlager-backend`
   - **Region:** Same as database
   - **Branch:** `claude/build-inventory-system-BaLjc`
   - **Root Directory:** `backend`
   - **Runtime:** **Node**
   - **Build Command:** `npm install && npm run migrate && npm run seed`
   - **Start Command:** `npm start`
   - **Plan:** **Free** ✅

4. **Environment Variables** - Click "Advanced" and add:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=[Paste the Internal Database URL from Step 2]
JWT_SECRET=[Click "Generate" button]
JWT_EXPIRE=7d
COMPANY_NAME=Sjuhärads Biluthyrning & Transport AB
COMPANY_ORG_NUMBER=556789-1234
COMPANY_ADDRESS=Borås, Sweden
COMPANY_PHONE=070-123 45 67
COMPANY_EMAIL=info@sjuharads.se
COMPANY_WEBSITE=www.sjuharads.se
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@sjuharads.se
EMAIL_PASS=your-email-password
EMAIL_FROM=noreply@sjuharads.se
FRONTEND_URL=[Leave blank for now, we'll add this later]
```

5. Click **"Create Web Service"**
6. Wait 5-10 minutes for deployment
7. **Copy the backend URL** (e.g., `https://7hlager-backend.onrender.com`)

---

### **Step 4: Deploy Frontend**

1. Click **"New +"** → **"Static Site"**
2. Connect the same GitHub repository
3. Configure:
   - **Name:** `7hlager-frontend`
   - **Branch:** `claude/build-inventory-system-BaLjc`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

4. **Environment Variables:**

```
VITE_API_URL=[Your backend URL from Step 3]/api
VITE_APP_NAME=7HLager
VITE_COMPANY_NAME=Sjuhärads Biluthyrning & Transport AB
```

Example:
```
VITE_API_URL=https://7hlager-backend.onrender.com/api
```

5. Click **"Create Static Site"**
6. Wait 3-5 minutes for deployment
7. **Your app is live!** 🎉

---

### **Step 5: Update Backend FRONTEND_URL**

1. Go back to your **backend service** in Render
2. Click **"Environment"**
3. Find `FRONTEND_URL` and update it with your frontend URL
4. Example: `https://7hlager-frontend.onrender.com`
5. Click **"Save Changes"**
6. Backend will redeploy automatically

---

## ✅ **You're Done!**

Your app is now live at:
- **Frontend:** `https://7hlager-frontend.onrender.com`
- **Backend API:** `https://7hlager-backend.onrender.com`

### **Login Credentials:**
- Email: `admin@sjuharads.se`
- Password: `Admin123!`

---

## 🎯 **What You Get (FREE):**

- ✅ Live public URL accessible from anywhere
- ✅ PostgreSQL database with 36,400 warehouse positions
- ✅ SSL certificate (HTTPS)
- ✅ Automatic deployments on git push
- ✅ 2 demo users pre-loaded
- ✅ 750 hours/month (enough for one service always running)

---

## ⚠️ **Important Notes:**

### **Free Tier Limitations:**
- Services **sleep after 15 minutes of inactivity**
- First request after sleep takes ~30 seconds to wake up
- 750 hours/month per service
- Database: 1 GB storage (plenty for this app)

### **Keep Services Awake (Optional):**
You can use a free service like **UptimeRobot** or **Cron-job.org** to ping your app every 10 minutes to keep it awake.

---

## 🔧 **Troubleshooting:**

### **Build Failed?**
- Check the build logs in Render dashboard
- Ensure all environment variables are set
- Verify the Root Directory is correct

### **Backend not connecting to database?**
- Check `DATABASE_URL` is set correctly
- Make sure you copied the **Internal Database URL**
- Database and backend should be in the **same region**

### **Frontend showing errors?**
- Verify `VITE_API_URL` points to your backend URL with `/api` at the end
- Check browser console for CORS errors
- Make sure backend `FRONTEND_URL` is set correctly

### **Migrations failed?**
- Check backend logs
- Database might still be provisioning (wait 2-3 minutes)
- Try manual redeploy

---

## 🆘 **Need Help?**

1. Check Render dashboard logs (very helpful!)
2. Look at the "Events" tab for each service
3. Render has great documentation at https://render.com/docs

---

## 🚀 **Ready to Deploy?**

Follow the steps above, and in **10 minutes** you'll have your app live online!

**Questions?** Just ask! 😊
