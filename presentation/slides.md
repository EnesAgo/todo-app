
marp: true
theme: default
paginate: true
size: 16:9
---

<style>
section { font-size: 24px; }
pre { font-size: 14px; }
code { font-size: 14px; }
</style>
---
# Todo App
## Docker & CI/CD Deployment

**Tech Stack:** React • Node.js • MongoDB • Caddy • Docker

**Live:** enesago.com

---

# 📋 What We Built

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Proxy**: Caddy (auto HTTPS)
- **Containers**: Docker
- **CI/CD**: GitHub Actions

---

# 🏗️ Architecture

```
        Internet
           │
           ▼
      ┌─────────┐
      │  CADDY  │ ← Port 80/443
      └────┬────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌─────────┐ ┌─────────┐
│FRONTEND │ │ BACKEND │
│ React   │ │ Node.js │
└─────────┘ └────┬────┘
                 ▼
           ┌──────────┐
           │ MONGODB  │
           └──────────┘
```

**Flow:** User → Caddy → Frontend/Backend → Database
**Benefits:** Single entry point, automatic HTTPS, load balancing

---

# 🐳 What is Docker?

**Package app + dependencies into a container**

| Term | Description |
|------|-------------|
| Image | Blueprint (recipe) |
| Container | Running instance |
| Dockerfile | Build instructions |

**Benefits:** Works everywhere, isolated, easy deploy

---

# 📄 Frontend Dockerfile

```dockerfile
# Build React app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve with Caddy
FROM caddy:2-alpine
COPY --from=build /app/build /usr/share/caddy
```

**Multi-stage build:** 500MB → 50MB (90% smaller!)
**Why?** Separates build tools from production runtime

---

# 📄 Backend Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Security: non-root user
RUN addgroup -S nodejs && adduser -S nodeuser
USER nodeuser

EXPOSE 3001
CMD ["npm", "start"]
```

**Security best practice:** Non-root user prevents privilege escalation
**Production optimized:** Only installs production dependencies

---

# 🌐 Caddyfile

```
enesago.com {
    handle /toDoList    { reverse_proxy backend:3001 }
    handle /newToDo     { reverse_proxy backend:3001 }
    handle /deleteToDo  { reverse_proxy backend:3001 }
    
    handle { reverse_proxy frontend:80 }
}
```

**What Caddy does:**
- Auto HTTPS (Let's Encrypt)
- Routes API calls → Backend
- Routes everything else → Frontend

---

# 📦 Docker Compose

```yaml
services:
  mongodb:
    image: mongo:7
  backend:
    build: ./backend
    environment:
      - MONGO_URI=mongodb://mongodb:27017/todoapp
  frontend:
    build: ./frontend
  caddy:
    ports: ["80:80", "443:443"]
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
```

**One command:** `docker-compose up -d`
**Benefits:** Multi-container orchestration, networking, persistence

---

# 🚀 GitHub Actions

```yaml
on:
  push:
    branches: [main]

jobs:
  deploy:
    steps:
      - uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SSH_HOST }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd ~/todo-app
            git pull
            docker-compose up -d --build
```

**Triggered on:** Every push to main branch
**Process:** SSH → Pull → Build → Deploy automatically

---

# 🔄 CI/CD Flow

```
Push to GitHub
      ↓
GitHub Actions triggered
      ↓
SSH into VM
      ↓
git pull
      ↓
docker-compose up --build
      ↓
Live in ~2 minutes! 🚀
```

---

# 💻 VM Commands

```bash
# Install Docker
sudo apt install docker.io docker-compose -y

# Memory fix for 512MB VMs (React builds need ~2GB)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Deploy
git clone https://github.com/EnesAgo/todo-app.git
cd todo-app
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose ps
```

**Swap memory:** Needed because React builds require more RAM than available

---

# ✅ Summary

| Component | Technology |
|-----------|------------|
| Frontend | React + Caddy |
| Backend | Node.js |
| Database | MongoDB |
| Proxy | Caddy |
| Containers | Docker |
| CI/CD | GitHub Actions |

**Push to GitHub → Auto deployed!**

---

# 🙋 Questions?

**Live:** https://enesago.com

**Repo:** github.com/EnesAgo/todo-app

Thank you!