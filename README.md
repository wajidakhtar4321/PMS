# Project Management System (PMS)

A comprehensive, full-stack Project Management System built with modern technologies for efficient project tracking, team collaboration, and performance analytics.

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework for production
- **React 18** - UI component library
- **Axios** - HTTP client for API calls
- **Recharts** - Data visualization and charts
- **Lucide React** - Beautiful icon library
- **CSS Modules** - Scoped component styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication & authorization
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
PMS/
├── backend/
│   ├── config/
│   │   └── db.js                    # Database configuration
│   ├── models/
│   │   ├── User.js                  # User model
│   │   ├── Project.js               # Project model
│   │   ├── Task.js                  # Task model
│   │   └── Comment.js               # Comment model
│   ├── controllers/
│   │   ├── userController.js        # User business logic
│   │   ├── projectController.js     # Project business logic
│   │   ├── taskController.js        # Task business logic
│   │   └── commentController.js     # Comment business logic
│   ├── routes/
│   │   ├── userRoutes.js            # User API routes
│   │   ├── projectRoutes.js         # Project API routes
│   │   ├── taskRoutes.js            # Task API routes
│   │   └── commentRoutes.js         # Comment API routes
│   ├── middlewares/
│   │   └── authMiddleware.js        # JWT authentication
│   ├── server.js                    # Entry point
│   └── .env.example                 # Environment variables template
│
├── frontend/
│   ├── components/
│   │   ├── Header.jsx               # Navigation header
│   │   ├── Footer.jsx               # Footer component
│   │   ├── Sidebar.jsx              # Dashboard sidebar
│   │   ├── Slider.jsx               # Hero slider
│   │   └── ProjectCard.jsx          # Project display card
│   ├── pages/
│   │   ├── index.jsx                # Home page
│   │   ├── about.jsx                # About page
│   │   ├── projects.jsx             # Projects listing
│   │   ├── dashboard.jsx            # Dashboard (Protected)
│   │   ├── login.jsx                # Login page
│   │   ├── register.jsx             # Registration page
│   │   └── _app.jsx                 # App wrapper
│   ├── styles/
│   │   ├── globals.css              # Global styles
│   │   └── ...                      # Component-specific styles
│   ├── utils/
│   │   └── api.js                   # API integration
│   └── public/
│       ├── logo.png
│       └── Slider Image/
│
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v7 or higher)

### 1️⃣ Database Setup

Start MongoDB on port 27017:
```bash
# If you have MongoDB installed
mongod --dbpath /data/db --port 27017

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from .env.example and update values
cp .env.example .env

# Start the server
npm start
```

The backend server will run on `http://localhost:5000`

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend application will run on `http://localhost:3000`

## 🌐 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (Protected)
- `GET /api/users` - Get all users (Protected)

### Projects
- `GET /api/projects` - Get all projects (Protected)
- `POST /api/projects` - Create new project (Protected)
- `GET /api/projects/:id` - Get project by ID (Protected)
- `PUT /api/projects/:id` - Update project (Protected)
- `DELETE /api/projects/:id` - Delete project (Protected)

### Tasks
- `GET /api/tasks` - Get all tasks (Protected)
- `POST /api/tasks` - Create new task (Protected)
- `GET /api/tasks/:id` - Get task by ID (Protected)
- `PUT /api/tasks/:id` - Update task (Protected)
- `DELETE /api/tasks/:id` - Delete task (Protected)

### Comments
- `GET /api/comments` - Get all comments (Protected)
- `POST /api/comments` - Create new comment (Protected)
- `GET /api/comments/:id` - Get comment by ID (Protected)
- `PUT /api/comments/:id` - Update comment (Protected)
- `DELETE /api/comments/:id` - Delete comment (Protected)

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pms_mobiloitte
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development

# Email Configuration (Optional)
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
EMAIL_FROM="Your App Name" <your-email@example.com>
```

## 🎯 Features

### User Management
- ✅ JWT-based authentication
- ✅ Password encryption with bcrypt
- ✅ Role-based access (Admin, Manager, Developer)
- ✅ User profile management

### Project Management
- ✅ Create, read, update, delete projects
- ✅ Project status tracking
- ✅ Priority levels
- ✅ Progress tracking
- ✅ Team member assignment

### Task Management
- ✅ Create, read, update, delete tasks
- ✅ Task status tracking
- ✅ Priority levels
- ✅ Due dates
- ✅ Assign tasks to team members

### Comment System
- ✅ Add comments to projects and tasks
- ✅ View comment history
- ✅ Edit and delete comments

### Dashboard Analytics
- ✅ Interactive charts
- ✅ Project statistics
- ✅ Recent projects overview

### UI/UX
- ✅ Responsive design
- ✅ Modern, clean interface
- ✅ Intuitive navigation
- ✅ Form validation

## 📦 Database Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (Unique),
  password: String (Hashed),
  role: String (admin/manager/developer),
  department: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  status: String (planning/in-progress/testing/completed/on-hold),
  priority: String (low/medium/high/critical),
  progress: Number (0-100),
  startDate: Date,
  endDate: Date,
  budget: Number,
  assignedTo: ObjectId (ref: User),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String (todo/in-progress/in-review/done),
  priority: String (low/medium/high/urgent),
  dueDate: Date,
  projectId: ObjectId (ref: Project),
  assignedTo: ObjectId (ref: User),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model
```javascript
{
  _id: ObjectId,
  content: String,
  projectId: ObjectId (ref: Project),
  taskId: ObjectId (ref: Task, optional),
  userId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Next.js dev server with hot reload
```

### Production Build

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm start
```

