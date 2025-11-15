import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import ProtectedRoute from '../components/ProtectedRoute';
import SummaryCards from '../components/SummaryCards';
import KanbanBoard from '../components/KanbanBoard';
import AddTaskModal from '../components/AddTaskModal';
import { getProjects, getProjectStats, getTasks, createTask, getAllUsers } from '../utils/api';
import { 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Briefcase,
  Users,
  ListTodo,
  UserPlus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState('todo');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, projectsRes, tasksRes, usersRes] = await Promise.all([
        getProjectStats(),
        getProjects(),
        getTasks({}),
        getAllUsers()
      ]);

      setStats(statsRes.data.data);
      setRecentProjects(projectsRes.data.data.slice(0, 5));
      setTasks(tasksRes.data.data || []);
      setUsers(usersRes.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const summaryCards = stats ? [
    {
      icon: Briefcase,
      label: 'Total Projects',
      value: stats.total,
      bgColor: '#EEF2FF',
      iconColor: '#4F46E5',
      change: 12
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: stats.completed,
      bgColor: '#D1FAE5',
      iconColor: '#10B981',
      change: 8
    },
    {
      icon: Clock,
      label: 'In Progress',
      value: stats.inProgress,
      bgColor: '#DBEAFE',
      iconColor: '#3B82F6',
      change: 5
    },
    {
      icon: ListTodo,
      label: 'Total Tasks',
      value: tasks.length,
      bgColor: '#FEF3C7',
      iconColor: '#F59E0B',
      change: -3
    }
  ] : [];

  const handleAddTask = (status) => {
    setDefaultTaskStatus(status);
    setIsTaskModalOpen(true);
  };

  const handleCreateTask = async (taskData) => {
    try {
      const dataWithStatus = {
        ...taskData,
        status: taskData.status || defaultTaskStatus
      };
      await createTask(dataWithStatus);
      setIsTaskModalOpen(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Header />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading dashboard...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Dashboard - Mobiloitte PMS</title>
        <meta name="description" content="Project Management Dashboard" />
      </Head>

      <Header />

      <div className={styles.dashboardLayout}>
        <Sidebar />

        <main className={styles.mainContent}>
          <div className={styles.container}>
            <div className={styles.welcomeSection}>
              <div>
                <h1 className={styles.welcomeTitle}>Welcome back, {user?.name}!</h1>
                <p className={styles.welcomeSubtitle}>
                  Here's what's happening with your projects today
                </p>
              </div>
              {user?.role === 'admin' && (
                <button 
                  className={styles.userDetailsBtn}
                  onClick={() => router.push('/admin/user-details')}
                >
                  <Users size={20} />
                  User Details
                </button>
              )}
            </div>

            {/* Summary Cards */}
            <SummaryCards cards={summaryCards} />

            {/* View Toggle */}
            <div className={styles.viewToggle}>
              <button
                className={`${styles.toggleBtn} ${activeView === 'overview' ? styles.active : ''}`}
                onClick={() => setActiveView('overview')}
              >
                Overview
              </button>
              <button
                className={`${styles.toggleBtn} ${activeView === 'kanban' ? styles.active : ''}`}
                onClick={() => setActiveView('kanban')}
              >
                Kanban Board
              </button>
            </div>

            {activeView === 'overview' ? (
              <>
                {/* Recent Projects */}
                <div className={styles.recentSection}>
                  <h2 className={styles.sectionTitle}>Recent Projects</h2>
                  <div className={styles.projectsList}>
                    {recentProjects.length > 0 ? (
                      recentProjects.map((project) => (
                        <div
                          key={project._id || project.id}
                          className={styles.projectItem}
                          onClick={() => router.push(`/projects/${project._id || project.id}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className={styles.projectInfo}>
                            <h3 className={styles.projectName}>{project.name}</h3>
                            <p className={styles.projectDescription}>
                              {project.description || 'No description'}
                            </p>
                          </div>
                          <div className={styles.projectMeta}>
                            <span className={`${styles.badge} ${styles[project.status]}`}>
                              {project.status}
                            </span>
                            <div className={styles.projectProgress}>
                              <div className={styles.progressBar}>
                                <div 
                                  className={styles.progressFill}
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                              <span className={styles.progressText}>{project.progress}%</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className={styles.emptyText}>No projects available</p>
                    )}
                  </div>
                </div>

                {/* Recent Tasks */}
                <div className={styles.recentSection}>
                  <h2 className={styles.sectionTitle}>Recent Tasks</h2>
                  <div className={styles.tasksList}>
                    {tasks.slice(0, 5).map((task) => (
                      <div key={task._id || task.id} className={styles.taskItem}>
                        <div className={styles.taskContent}>
                          <h4>{task.title}</h4>
                          <p>{task.description}</p>
                        </div>
                        <span className={`${styles.taskStatus} ${styles[task.status]}`}>
                          {task.status}
                        </span>
                      </div>
                    ))}
                    {tasks.length === 0 && (
                      <p className={styles.emptyText}>No tasks yet</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.kanbanSection}>
                <h2 className={styles.sectionTitle}>Task Board</h2>
                <KanbanBoard
                  tasks={tasks}
                  onTaskClick={(task) => console.log('Task clicked:', task)}
                  onAddTask={handleAddTask}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      <AddTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        projects={recentProjects.length > 0 ? recentProjects : []}
        users={users}
      />

      <Footer />
    </ProtectedRoute>
  );
}
