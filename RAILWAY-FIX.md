# Railway Deployment Guide - Fix for Build Error

## ✅ Solution for "Railpack could not determine how to build"

I've created the necessary configuration files. Here's what to do:

### Step 1: Make Sure You Have These Files

Check that these files are in your project:
- ✅ `package.json` (updated)
- ✅ `railway.json` (NEW - tells Railway how to deploy)
- ✅ `nixpacks.toml` (NEW - build configuration)
- ✅ `websocket-server.js` (your main server file)

### Step 2: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Add Railway configuration"

# Add your GitHub repo (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push
git push -u origin main
```

### Step 3: Deploy on Railway

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Railway will automatically detect the configuration and deploy!

### Step 4: Configure Environment (Optional)

In Railway dashboard:
1. Click on your service
2. Go to **"Variables"** tab
3. Add these if needed:
   - `PORT` = Railway sets this automatically (leave it)
   - `NODE_ENV` = `production`

### Step 5: Get Your WebSocket URL

1. In Railway dashboard, click your service
2. Go to **"Settings"** tab
3. Scroll to **"Networking"**
4. Click **"Generate Domain"**
5. You'll get a URL like: `your-app.up.railway.app`

Your WebSocket URL will be: `wss://your-app.up.railway.app`

---

## 🐛 Troubleshooting

### Error: "No package.json found"
**Fix:** Make sure `package.json` is in the root of your repository

### Error: "Build failed"
**Fix:** Check Railway logs:
1. Click on your service
2. Go to "Deployments" tab
3. Click on the failed deployment
4. Check the logs

### Error: "Application failed to start"
**Fix:** Make sure your server uses the PORT environment variable:
```javascript
const PORT = process.env.PORT || 8080;
```

### Port Already in Use
Railway automatically assigns a port. Your code should be:
```javascript
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });
```

---

## 🎯 Alternative: Use Railway CLI

If the web interface doesn't work:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Get URL
railway domain
```

---

## 📊 Check If It's Working

### Test with Browser Console:
```javascript
const ws = new WebSocket('wss://your-app.up.railway.app');

ws.onopen = () => console.log('✅ Connected!');
ws.onmessage = (e) => console.log('📨 Message:', e.data);
ws.onerror = (e) => console.error('❌ Error:', e);
```

### Test with wscat:
```bash
npm install -g wscat
wscat -c wss://your-app.up.railway.app
```

---

## 🆓 Railway Free Tier Limits

- **500 hours/month** (enough for 24/7)
- **100 GB outbound traffic**
- **8 GB RAM**
- **8 vCPU**
- **No sleep time** (unlike Heroku/Render)

---

## 🚀 Files You Need to Upload to GitHub

Make sure ALL these files are committed and pushed:

```
your-project/
├── websocket-server.js       ✅ Main server
├── package.json              ✅ Dependencies & scripts
├── railway.json              ✅ Railway config (NEW)
├── nixpacks.toml            ✅ Build config (NEW)
├── .gitignore               ✅ Ignore node_modules
└── README.md                (optional)
```

**Don't forget:**
```bash
git add railway.json nixpacks.toml
git commit -m "Add Railway configuration files"
git push
```

---

## ✨ Expected Result

After deployment, you should see in Railway logs:
```
🚀 WebSocket server started
📡 Listening on 0.0.0.0:XXXX
🌍 Environment: production
```

Then you can connect from anywhere using:
`wss://your-app.up.railway.app`

---

## 🔄 Alternative Free Options If Railway Doesn't Work

### 1. Render (Also Free)
- Go to https://render.com
- No special config needed
- Just select "Web Service" and connect GitHub
- Set start command: `node websocket-server.js`

### 2. Fly.io (Free Tier)
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Deploy
fly launch
fly deploy
```

### 3. Cyclic (Very Simple)
- Go to https://cyclic.sh
- Connect GitHub
- Auto-deploys (no config needed)

---

## 📞 Still Having Issues?

If you're still getting the build error:

1. **Check Railway logs** - They show exactly what's wrong
2. **Verify package.json has "start" script**
3. **Make sure all files are pushed to GitHub**
4. **Try Railway CLI instead of web interface**

Or try Render - it's even simpler and doesn't need these config files!
