# Deployment Guide

This guide will help you deploy IGDTUW EDUHub to various platforms.

## Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend) - Recommended

#### Frontend Deployment (Vercel)

1. **Install Vercel CLI** (optional):
```bash
npm install -g vercel
```

2. **Deploy via Vercel Dashboard**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Framework Preset: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     - `VITE_API_URL`: Your backend URL (e.g., `https://your-backend.onrender.com`)

3. **Or deploy via CLI**:
```bash
cd frontend
vercel
```

#### Backend Deployment (Render)

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `igdtuw-eduhub-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     DATABASE_URL=file:./dev.db
     JWT_SECRET=your-super-secret-jwt-key-change-this
     PORT=5000
     NODE_ENV=production
     FRONTEND_URL=https://your-frontend.vercel.app
     ```

5. Click "Create Web Service"

---

### Option 2: Railway (Full Stack)

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect both services
5. Configure environment variables for backend:
   ```
   DATABASE_URL=file:./dev.db
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   FRONTEND_URL=https://your-frontend-url
   ```

---

### Option 3: Netlify (Frontend) + Railway (Backend)

#### Frontend (Netlify)

1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
   - **Environment variables**:
     - `VITE_API_URL`: Your backend URL

#### Backend (Railway)

Follow Railway instructions from Option 2

---

### Option 4: Docker Deployment (Self-hosted)

1. **Build and run with Docker Compose**:
```bash
docker-compose up -d
```

2. **For production**, update `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=file:./dev.db
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/dev.db:/app/dev.db
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

---

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend
Create `.env.production` in frontend directory:
```env
VITE_API_URL=https://your-backend-url.com
```

---

## Post-Deployment Steps

1. **Seed the Database**:
```bash
cd backend
npm run prisma:seed
```

2. **Test the Deployment**:
   - Visit your frontend URL
   - Try logging in with default credentials:
     - Admin: `admin@example.com` / `password123`
     - Mod: `mod@example.com` / `password123`

3. **Update CORS Settings**:
   - In `backend/server.js`, update CORS origin to your frontend URL

4. **Change Default Passwords**:
   - Log in as admin
   - Create new admin account
   - Delete default accounts

---

## Database Considerations

### For Production (Recommended):

Replace SQLite with PostgreSQL:

1. **Update `backend/prisma/schema.prisma`**:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. **Update DATABASE_URL**:
```
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

3. **Run migrations**:
```bash
npx prisma migrate deploy
```

---

## Troubleshooting

### Frontend can't connect to backend
- Check CORS settings in `backend/server.js`
- Verify `VITE_API_URL` environment variable
- Ensure backend is running and accessible

### Database errors
- Run `npm run prisma:generate`
- Run `npm run prisma:migrate`
- Check DATABASE_URL is correct

### File uploads not working
- Ensure `uploads` directory exists
- Check file permissions
- Verify multer configuration

---

## Monitoring

- **Vercel**: Built-in analytics and logs
- **Render**: Logs tab in dashboard
- **Railway**: Logs and metrics in dashboard
- **Docker**: `docker-compose logs -f`

---

## Scaling

For high traffic:
1. Use PostgreSQL instead of SQLite
2. Implement Redis for session management
3. Use CDN for static assets
4. Enable caching
5. Consider serverless functions for API

---

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Update CORS origins
- [ ] Enable HTTPS
- [ ] Change default admin password
- [ ] Set up rate limiting
- [ ] Enable environment-based configs
- [ ] Secure file upload validation
- [ ] Regular security updates

---

## Support

For issues, visit: https://github.com/VrindaNarang/IGDTUW_EDU_HUB/issues
