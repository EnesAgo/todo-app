# Live Demo Script

## Option 1: Show the App Working (30 seconds)

1. **Open browser**: https://enesago.com
2. **Add a todo**: Type "Demo todo" → Click "Add"
3. **Show it appears** in the list
4. **Delete it**: Click "Delete" button
5. **Done!** Simple but it shows full-stack working

---

## Option 2: Show GitHub Actions (1 minute)

### Before the presentation:
Make a small change ready to commit.

### During demo:

```bash
# 1. Make a small change (in App.js, change title)
# Change: "Todo List" → "My Todo List"

# 2. Commit and push
git add -A
git commit -m "Demo: update title"
git push origin main
```

Then:
1. **Open GitHub** → Actions tab
2. **Show the workflow running**
3. **Wait for completion** (or skip if time is short)
4. **Refresh the app** to show the change is live

---

## Option 3: Show Docker Commands (1 minute)

SSH into your VM and run:

```bash
# Show running containers
sudo docker-compose -f docker-compose.prod.yml ps

# Expected output:
# todo-backend    Up (healthy)
# todo-caddy      Up
# todo-frontend   Up
# todo-mongodb    Up

# Show logs (quick peek)
sudo docker-compose -f docker-compose.prod.yml logs --tail 5 backend

# Show resource usage
sudo docker stats --no-stream
```

---

## Quick Talking Points During Demo

### When showing the app:
> "This is a simple todo app - React frontend, Node.js backend, MongoDB database. All running in Docker containers on a $4/month VM."

### When showing GitHub Actions:
> "When I push code, GitHub Actions automatically SSHs into my server, pulls the code, and rebuilds the containers. Zero manual deployment."

### When showing Docker:
> "Four containers working together - frontend, backend, database, and Caddy for HTTPS. One command starts everything."

---

## If Something Goes Wrong

### App not loading?
> "Let me check the containers..." 
```bash
sudo docker-compose -f docker-compose.prod.yml ps
sudo docker-compose -f docker-compose.prod.yml restart backend
```

### Skip the live demo:
> "Due to time, let me just show you the architecture diagram instead..."

Go back to the architecture slide.

---

## Time Management

| Demo Type | Time |
|-----------|------|
| Just show app | 30 sec |
| App + explain | 1 min |
| GitHub Actions | 1-2 min |
| Docker commands | 1 min |
| Full demo | 2-3 min |

**Recommendation**: Just show the app working + quick GitHub Actions view. Save Docker commands for Q&A.
