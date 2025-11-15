# Mobiloitte Project Management System (PMS)

A comprehensive, full-stack **Project Management System** built with modern technologies for efficient project tracking, team collaboration, and performance analytics.

---

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

---

## 📁 Project Structure

```
PMS/
├── backend/
│   ├── config/
│   │   └── db.js                    # Database configuration
│   ├── models/
│   │   ├── User.js                  # User model
│   │   └── Project.js               # Project model
│   ├── controllers/
│   │   ├── userController.js        # User business logic
│   │   └── projectController.js     # Project business logic
│   ├── routes/
│   │   ├── userRoutes.js            # User API routes
│   │   └── projectRoutes.js         # Project API routes
│   ├── middlewares/
│   │   └── authMiddleware.js        # JWT authentication
│   ├── server.js                    # Entry point
│   ├── package.json
│   └── .env
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
│   │   ├── Header.module.css
│   │   ├── Footer.module.css
│   │   ├── Sidebar.module.css
│   │   ├── Slider.module.css
│   │   ├── ProjectCard.module.css
│   │   ├── Home.module.css
│   │   ├── About.module.css
│   │   ├── Projects.module.css
│   │   ├── Dashboard.module.css
│   │   └── Auth.module.css
│   ├── utils/
│   │   └── api.js                   # API integration
│   ├── public/
│   │   ├── logo.png
│   │   └── Slider Image/
│   ├── package.json
│   ├── next.config.js
│   └── .env.local
│
├── LogoImages/                      # Company logos
├── Slider Image/                    # Slider images
└── README.md
```

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v7 or higher) - See installation options below
- npm or yarn

### 1️⃣ Database Setup

**Option 1: Quick Start with Manual Installation (Recommended)**
```bash
# Run the MongoDB installation script
./start-mongodb-manual.sh
```

**Option 2: Docker (Fastest)**
```bash
# Start MongoDB with Docker
docker-compose up -d
```

**Option 3: Homebrew (macOS)**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Option 4: MongoDB Atlas (Cloud - Production)**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string and update in `backend/.env`

Update database connection in `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/pms_mobiloitte
JWT_SECRET=your_jwt_secret_key_here
```

📚 **Detailed Setup Guides**:
- Manual Installation: See [`MONGODB_SETUP.md`](./backend/MONGODB_SETUP.md)
- Docker Setup: See [`DOCKER_SETUP.md`](./DOCKER_SETUP.md)
- Migration Details: See [`MIGRATION_COMPLETE.md`](./MIGRATION_COMPLETE.md)

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm run dev
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

---

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
- `GET /api/projects/stats` - Get project statistics (Protected)

---

## 📄 Pages

### Public Pages
- **Home** (`/`) - Landing page with unified login option
- **About** (`/about`) - Company information, mission, vision, team
- **Projects** (`/projects`) - Browse all projects (requires login)
- **Login** (`/login`) - Unified login page for both administrators and users
- **Register** (`/register`) - New user registration (admin only)

### Protected Pages
- **Dashboard** (`/dashboard`) - Analytics, charts, recent projects

---

## 🎨 Features

### User Management
- ✅ JWT-based authentication
- ✅ Password encryption with bcrypt
- ✅ Role-based access (Admin, Manager, Developer)
- ✅ Unified login system for both administrators and users
- ✅ User profile management

### Project Management
- ✅ Create, read, update, delete projects
- ✅ Project status tracking (Planning, In Progress, Testing, Completed, On Hold)
- ✅ Priority levels (Low, Medium, High, Critical)
- ✅ Progress tracking (0-100%)
- ✅ Budget management
- ✅ Team member assignment
- ✅ Date tracking (start/end dates)

### Dashboard Analytics
- ✅ Interactive charts (Bar chart, Pie chart)
- ✅ Project statistics
- ✅ Recent projects overview
- ✅ Status distribution

### UI/UX
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Modern, clean interface
- ✅ Smooth animations and transitions
- ✅ Intuitive navigation
- ✅ Form validation

---

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=pms_mobiloitte
JWT_SECRET=mobiloitte_pms_secret_key_2025
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🧪 Testing the Application

### 1. Register a New User
- Navigate to `/register`
- Fill in the registration form
- Submit to create account

### 2. Login
- Go to `/login` (unified login page for both administrators and users)
- Enter credentials
- Access protected dashboard

### 3. Create Projects
- Visit `/projects`
- Click "New Project"
- Fill in project details
- View in dashboard

---

## 📦 Database Models

### User Model
```javascript
{
  id: INTEGER (Primary Key),
  name: STRING,
  email: STRING (Unique),
  password: STRING (Hashed),
  role: ENUM (admin, manager, developer),
  department: STRING,
  isActive: BOOLEAN,
  createdAt: DATE,
  updatedAt: DATE
}
```

### Project Model
```javascript
{
  id: INTEGER (Primary Key),
  name: STRING,
  description: TEXT,
  status: ENUM (planning, in-progress, testing, completed, on-hold),
  priority: ENUM (low, medium, high, critical),
  progress: INTEGER (0-100),
  startDate: DATE,
  endDate: DATE,
  budget: DECIMAL,
  assignedTo: INTEGER (Foreign Key -> User),
  createdBy: INTEGER (Foreign Key -> User),
  createdAt: DATE,
  updatedAt: DATE
}
```

---

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

---

## 🎯 Future Enhancements

- [ ] Task management within projects
- [ ] File attachments and document management
- [ ] Real-time notifications
- [ ] Team chat/messaging
- [ ] Calendar integration
- [ ] Email notifications
- [ ] Advanced reporting
- [ ] Export data (PDF, Excel)
- [ ] Mobile application
- [ ] Dark mode

---

## 📦 Database Migration (MySQL → MongoDB)

**Status**: ✅ **Migration Completed Successfully!**

This project has been migrated from MySQL/Sequelize to MongoDB/Mongoose.

### What Changed
- Database: MySQL → MongoDB
- ORM: Sequelize → Mongoose
- Primary Key: `id` → `_id` (MongoDB ObjectId)
- All CRUD operations tested and working

### Key Differences
```javascript
// Before (MySQL response)
{ "id": 1, "name": "Test User" }

// After (MongoDB response)
{ "_id": "68ef24001a5c843325ec4329", "name": "Test User" }
```

### Documentation
- **Migration Summary**: [`MIGRATION_COMPLETE.md`](./MIGRATION_COMPLETE.md)
- **Test Results**: [`MIGRATION_TEST_RESULTS.md`](./MIGRATION_TEST_RESULTS.md)
- **Setup Guide**: [`MONGODB_SETUP.md`](./backend/MONGODB_SETUP.md)
- **Docker Setup**: [`DOCKER_SETUP.md`](./DOCKER_SETUP.md)

### Frontend Compatibility
Minor updates may be needed in frontend to handle `_id` instead of `id`. See [`MIGRATION_COMPLETE.md`](./MIGRATION_COMPLETE.md) for details.

---

## 👥 Contributors

- **Mobiloitte Team** - Full-stack development

---

## 📝 License

This project is proprietary software developed by Mobiloitte.

---

## 📞 Support

For support, email: contact@mobiloitte.com

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Recharts for beautiful data visualization
- Lucide for icon library
- MongoDB for scalable database
- Mongoose for powerful ODM

---

**Built with ❤️ by Mobiloitte**
