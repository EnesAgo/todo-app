# Quick Reference Cheatsheet

## 🐳 Docker Commands

```bash
# Build and run all services
docker-compose -f docker-compose.prod.yml up -d --build

# Stop all services
docker-compose -f docker-compose.prod.yml down

# View running containers
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
docker-compose -f docker-compose.prod.yml logs backend

# Restart a service
docker-compose -f docker-compose.prod.yml restart backend

# Clean up old images
docker image prune -f

# Nuclear cleanup (removes everything)
docker system prune -af --volumes
```

---

## 📁 Project Structure

```
todo-app/
├── frontend/
│   ├── Dockerfile          # React build + Caddy serve
│   ├── package.json
│   └── src/App.js
├── backend/
│   ├── Dockerfile          # Node.js API
│   ├── package.json
│   └── index.js
├── Caddyfile               # Reverse proxy config
├── docker-compose.yml      # Development
├── docker-compose.prod.yml # Production
└── .github/workflows/
    └── main.yml            # CI/CD pipeline
```

---

## 🌐 Caddyfile Routing

```
Request                    → Routes to
─────────────────────────────────────────
enesago.com/toDoList       → backend:3001
enesago.com/newToDo        → backend:3001
enesago.com/deleteToDo     → backend:3001
enesago.com/*              → frontend:80
```

---

## 🔑 GitHub Secrets

| Name | Value |
|------|-------|
| `SSH_HOST` | 167.71.54.108 |
| `SSH_USERNAME` | root |
| `SSH_PRIVATE_KEY` | (private key content) |

---

## 📡 API Endpoints

| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/toDoList` | - |
| POST | `/newToDo` | `{"text": "..."}` |
| DELETE | `/deleteToDo?id=xxx` | - |

---

## 🛠️ Troubleshooting

```bash
# Container keeps restarting?
docker-compose -f docker-compose.prod.yml logs <service>

# Out of memory?
free -h
sudo swapon --show

# Add swap if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Port already in use?
sudo lsof -i :80
sudo systemctl stop caddy  # if system Caddy is running
```

---

## 🔄 CI/CD Flow

```
git push → GitHub Actions → SSH to VM → git pull → docker-compose up → Done!
```

Time: ~2-3 minutes from push to live
