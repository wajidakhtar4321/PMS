# MongoDB Commands Reference 🗄️

**Quick reference for managing MongoDB from the backend terminal**

---

## 📍 Working Directory

All these commands should be run from the **backend directory**:

```bash
cd /Users/admin/Desktop/PMS/backend
```

Or from the **project root**:

```bash
cd /Users/admin/Desktop/PMS
```

---

## 🚀 Starting MongoDB

### Method 1: Using the Manual Start Script (Recommended)

```bash
# From project root
./start-mongodb-manual.sh

# From backend directory
../start-mongodb-manual.sh
```

### Method 2: Direct Command

```bash
# Start MongoDB with specific paths
mongod --dbpath ~/.mongodb/data --logpath ~/.mongodb/logs/mongodb.log --fork --port 27017
```

### Method 3: If installed via Homebrew

```bash
brew services start mongodb-community
```

### Method 4: Using Docker

```bash
# From project root
docker-compose up -d mongodb

# From backend directory
cd .. && docker-compose up -d mongodb
```

---

## 🛑 Stopping MongoDB

### Stop MongoDB Process

```bash
# Kill MongoDB process (works from any directory)
pkill -f mongod

# Or more gracefully
mongosh admin --eval "db.shutdownServer()"
```

### Stop Docker MongoDB

```bash
# From project root
docker-compose down

# From backend directory
cd .. && docker-compose down
```

---

## 🔍 Checking MongoDB Status

### Check if MongoDB is Running

```bash
# Check port 27017
lsof -i :27017

# Check process
ps aux | grep mongod

# Or using pgrep
pgrep -f mongod
```

### Quick Connection Test

```bash
# Test connection (from any directory)
mongosh --eval "db.adminCommand('ping')"

# Should output: { ok: 1 }
```

---

## 💻 MongoDB Shell Access

### Connect to MongoDB Shell

```bash
# Method 1: Using installed mongosh
~/.mongodb/bin/mongosh

# Method 2: If mongosh is in PATH
mongosh

# Method 3: Connect to specific database
~/.mongodb/bin/mongosh pms_mobiloitte

# Method 4: With connection string
mongosh "mongodb://localhost:27017/pms_mobiloitte"
```

---

## 📊 Database Statistics & Information

### From Terminal (One-liner Commands)

```bash
# Get database stats
mongosh pms_mobiloitte --eval "db.stats()"

# Show all databases
mongosh --eval "show dbs"

# Show all collections
mongosh pms_mobiloitte --eval "show collections"

# Count documents in users collection
mongosh pms_mobiloitte --eval "db.users.countDocuments()"

# Count documents in projects collection
mongosh pms_mobiloitte --eval "db.projects.countDocuments()"

# Count documents in tasks collection
mongosh pms_mobiloitte --eval "db.tasks.countDocuments()"

# Count documents in comments collection
mongosh pms_mobiloitte --eval "db.comments.countDocuments()"

# Get all collections info
mongosh pms_mobiloitte --eval "db.getCollectionNames()"

# Get server status
mongosh admin --eval "db.serverStatus()"
```

### From Backend Terminal - Useful Commands

```bash
# Navigate to backend directory first
cd /Users/admin/Desktop/PMS/backend

# 1. Check database stats
mongosh pms_mobiloitte --eval "db.stats()"

# 2. View all users
mongosh pms_mobiloitte --eval "db.users.find().pretty()"

# 3. View all projects
mongosh pms_mobiloitte --eval "db.projects.find().pretty()"

# 4. View all tasks
mongosh pms_mobiloitte --eval "db.tasks.find().pretty()"

# 5. View all comments
mongosh pms_mobiloitte --eval "db.comments.find().pretty()"

# 6. Count total records
mongosh pms_mobiloitte --eval "printjson({
  users: db.users.countDocuments(),
  projects: db.projects.countDocuments(),
  tasks: db.tasks.countDocuments(),
  comments: db.comments.countDocuments()
})"
```

---

## 🔧 Interactive MongoDB Shell

### Enter Interactive Mode

```bash
# Start interactive shell
~/.mongodb/bin/mongosh pms_mobiloitte
```

### Common Commands Inside Shell

```javascript
// Show current database
db

// Show all databases
show dbs

// Switch database
use pms_mobiloitte

// Show all collections
show collections

// Count documents
db.users.countDocuments()
db.projects.countDocuments()
db.tasks.countDocuments()
db.comments.countDocuments()

// Find all users
db.users.find().pretty()

// Find one user
db.users.findOne()

// Find user by email
db.users.findOne({ email: "test@example.com" })

// Find all projects
db.projects.find().pretty()

// Find projects by status
db.projects.find({ status: "in-progress" })

// Find tasks by project
db.tasks.find({ projectId: ObjectId("PROJECT_ID_HERE") })

// Get database stats
db.stats()

// Get collection stats
db.users.stats()

// Drop a collection (⚠️ careful!)
db.collectionName.drop()

// Drop entire database (⚠️ very careful!)
db.dropDatabase()

// Exit shell
exit
```

---

## 🧪 Testing Database Connection

### From Backend Terminal

```bash
cd /Users/admin/Desktop/PMS/backend

# Test 1: Check if MongoDB is accessible
mongosh --eval "db.adminCommand('ping')" && echo "✅ MongoDB is running" || echo "❌ MongoDB is not running"

# Test 2: Check our database exists
mongosh --eval "db.adminCommand('listDatabases')" | grep pms_mobiloitte

# Test 3: Count collections
mongosh pms_mobiloitte --eval "db.getCollectionNames().length + ' collections found'"

# Test 4: Verify backend can connect
npm start &
sleep 3
curl http://localhost:5000
pkill -f "node server.js"
```

---

## 📝 Common Backend Development Commands

### During Development

```bash
# 1. Start MongoDB
../start-mongodb-manual.sh

# 2. Check if running
lsof -i :27017

# 3. View logs
tail -f ~/.mongodb/logs/mongodb.log

# 4. Start backend server
npm start

# 5. In another terminal - check database
mongosh pms_mobiloitte --eval "db.stats()"

# 6. Monitor connections
watch -n 2 "mongosh pms_mobiloitte --eval 'db.currentOp()'"
```

---

## 🔄 Database Management

### Backup Database

```bash
# From backend directory
~/.mongodb/bin/mongodump --db=pms_mobiloitte --out=../backup

# Or from project root
~/.mongodb/bin/mongodump --db=pms_mobiloitte --out=./backup
```

### Restore Database

```bash
# From backend directory
~/.mongodb/bin/mongorestore --db=pms_mobiloitte ../backup/pms_mobiloitte

# Or from project root
~/.mongodb/bin/mongorestore --db=pms_mobiloitte ./backup/pms_mobiloitte
```

### Clear Database (⚠️ Destructive!)

```bash
# Clear all collections
mongosh pms_mobiloitte --eval "db.dropDatabase()"

# Or clear specific collection
mongosh pms_mobiloitte --eval "db.users.deleteMany({})"
```

---

## 📊 Monitoring & Debugging

### View Real-time Logs

```bash
# From any directory
tail -f ~/.mongodb/logs/mongodb.log

# With grep filter
tail -f ~/.mongodb/logs/mongodb.log | grep -i error
```

### Check Database Size

```bash
mongosh pms_mobiloitte --eval "
  var stats = db.stats();
  print('Database: ' + stats.db);
  print('Collections: ' + stats.collections);
  print('Data Size: ' + (stats.dataSize / 1024 / 1024).toFixed(2) + ' MB');
  print('Index Size: ' + (stats.indexSize / 1024 / 1024).toFixed(2) + ' MB');
"
```

### Check Collection Indexes

```bash
mongosh pms_mobiloitte --eval "db.users.getIndexes()"
mongosh pms_mobiloitte --eval "db.projects.getIndexes()"
mongosh pms_mobiloitte --eval "db.tasks.getIndexes()"
mongosh pms_mobiloitte --eval "db.comments.getIndexes()"
```

---

## 🛠️ Troubleshooting Commands

### Issue: Can't connect to MongoDB

```bash
# 1. Check if MongoDB is running
lsof -i :27017

# 2. Check MongoDB logs
tail -n 50 ~/.mongodb/logs/mongodb.log

# 3. Try to start MongoDB
../start-mongodb-manual.sh

# 4. Check permissions
ls -la ~/.mongodb/data
```

### Issue: Database is empty

```bash
# 1. Verify database exists
mongosh --eval "show dbs" | grep pms_mobiloitte

# 2. Check collections
mongosh pms_mobiloitte --eval "show collections"

# 3. Check if backend created data
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# 4. Verify data was created
mongosh pms_mobiloitte --eval "db.users.find().pretty()"
```

### Issue: Port already in use

```bash
# 1. Find what's using port 27017
lsof -i :27017

# 2. Kill the process
pkill -f mongod

# 3. Restart MongoDB
../start-mongodb-manual.sh
```

---

## 📋 Quick Reference Card

### Must-Know Commands (Backend Terminal)

```bash
# ⭐ Start MongoDB
../start-mongodb-manual.sh

# ⭐ Check if running
lsof -i :27017

# ⭐ Stop MongoDB
pkill -f mongod

# ⭐ View database stats
mongosh pms_mobiloitte --eval "db.stats()"

# ⭐ Enter interactive shell
~/.mongodb/bin/mongosh pms_mobiloitte

# ⭐ View logs
tail -f ~/.mongodb/logs/mongodb.log

# ⭐ Start backend
npm start

# ⭐ Test connection
mongosh --eval "db.adminCommand('ping')"
```

---

## 🎯 Typical Development Workflow

### Morning Startup

```bash
# 1. Navigate to backend
cd /Users/admin/Desktop/PMS/backend

# 2. Start MongoDB (if not running)
lsof -i :27017 || ../start-mongodb-manual.sh

# 3. Check database health
mongosh pms_mobiloitte --eval "db.stats()"

# 4. Start backend server
npm start
```

### During Development

```bash
# Check data while developing
mongosh pms_mobiloitte --eval "db.users.find().pretty()"

# Monitor logs
tail -f ~/.mongodb/logs/mongodb.log

# Test API and check DB
curl http://localhost:5000/api/users/profile -H "Authorization: Bearer TOKEN"
mongosh pms_mobiloitte --eval "db.users.countDocuments()"
```

### End of Day

```bash
# Optional: Stop MongoDB to free resources
pkill -f mongod

# Or keep it running for next day
# MongoDB can run continuously
```

---

## 💡 Pro Tips

### Aliases for Efficiency

Add to your `~/.zshrc` or `~/.bashrc`:

```bash
# MongoDB aliases
alias mongosh-pms="~/.mongodb/bin/mongosh pms_mobiloitte"
alias mongo-stats="mongosh pms_mobiloitte --eval 'db.stats()'"
alias mongo-start="../start-mongodb-manual.sh"
alias mongo-stop="pkill -f mongod"
alias mongo-check="lsof -i :27017"
alias mongo-logs="tail -f ~/.mongodb/logs/mongodb.log"

# Backend aliases
alias pms-backend="cd /Users/admin/Desktop/PMS/backend"
alias pms-start="npm start"
alias pms-dev="npm run dev"
```

Then reload: `source ~/.zshrc`

Usage:
```bash
pms-backend      # Navigate to backend
mongo-start      # Start MongoDB
mongo-check      # Verify it's running
mongosh-pms      # Enter shell
pms-start        # Start backend server
```

---

## 📚 Additional Resources

- **MongoDB Manual**: https://www.mongodb.com/docs/manual/
- **Mongosh Documentation**: https://www.mongodb.com/docs/mongodb-shell/
- **Project Setup Guide**: `../MONGODB_SETUP.md`
- **Quick Start Guide**: `../QUICK_START.md`
- **Docker Setup**: `../DOCKER_SETUP.md`

---

**Last Updated**: October 15, 2025  
**MongoDB Version**: 7.0.15  
**Project**: Mobiloitte PMS  

🚀 Happy Database Management!
