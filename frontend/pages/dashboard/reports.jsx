import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { getProjects, getTasks, getProjectStats } from '../../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, TrendingUp } from 'lucide-react';
import styles from '../../styles/Reports.module.css';

export default function Reports() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, tasksRes] = await Promise.all([
        getProjects(),
        getTasks({})
      ]);
      
      const projectsData = projectsRes.data.data || [];
      const tasksData = tasksRes.data.data || [];
      
      setProjects(projectsData);
      setTasks(tasksData);
      
      // Calculate stats from projects data
      const calculatedStats = {
        total: projectsData.length,
        planning: projectsData.filter(p => p.status === 'planning').length,
        inProgress: projectsData.filter(p => p.status === 'in-progress').length,
        testing: projectsData.filter(p => p.status === 'testing').length,
        completed: projectsData.filter(p => p.status === 'completed').length,
        onHold: projectsData.filter(p => p.status === 'on-hold').length,
      };
      
      setStats(calculatedStats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const projectStatusData = stats ? [
    { name: 'Planning', value: stats.planning || 0, color: '#9CA3AF' },
    { name: 'In Progress', value: stats.inProgress || 0, color: '#3B82F6' },
    { name: 'Testing', value: stats.testing || 0, color: '#F59E0B' },
    { name: 'Completed', value: stats.completed || 0, color: '#10B981' },
    { name: 'On Hold', value: stats.onHold || 0, color: '#EF4444' },
  ] : [];

  const taskStatusData = [
    { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length, color: '#9CA3AF' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#3B82F6' },
    { name: 'Review', value: tasks.filter(t => t.status === 'review').length, color: '#F59E0B' },
    { name: 'Done', value: tasks.filter(t => t.status === 'done').length, color: '#10B981' },
  ];

  const priorityData = [
    { name: 'Low', value: projects.filter(p => p.priority === 'low').length + tasks.filter(t => t.priority === 'low').length },
    { name: 'Medium', value: projects.filter(p => p.priority === 'medium').length + tasks.filter(t => t.priority === 'medium').length },
    { name: 'High', value: projects.filter(p => p.priority === 'high').length + tasks.filter(t => t.priority === 'high').length },
    { name: 'Critical', value: projects.filter(p => p.priority === 'critical').length + tasks.filter(t => t.priority === 'critical').length },
  ];

  return (
    <ProtectedRoute>
      <Head>
        <title>Reports - Mobiloitte PMS</title>
      </Head>

      <Header />

      <div className={styles.layout}>
        <Sidebar />

        <main className={styles.mainContent}>
          <div className={styles.container}>
            <div className={styles.header}>
              <div>
                <h1 className={styles.title}>Reports & Analytics</h1>
                <p className={styles.subtitle}>View insights and performance metrics</p>
              </div>
              <button className={styles.exportButton}>
                <Download size={20} />
                Export Report
              </button>
            </div>

            {loading ? (
              <div className={styles.loading}>Loading reports...</div>
            ) : (
              <>
                {/* Summary Cards */}
                <div className={styles.summaryCards}>
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3>Total Projects</h3>
                      <TrendingUp className={styles.trendIcon} />
                    </div>
                    <div className={styles.cardValue}>{stats?.total || 0}</div>
                    <div className={styles.cardSubtext}>Active projects</div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3>Completion Rate</h3>
                      <TrendingUp className={styles.trendIcon} />
                    </div>
                    <div className={styles.cardValue}>
                      {stats?.total ? Math.round((stats.completed / stats.total) * 100) : 0}%
                    </div>
                    <div className={styles.cardSubtext}>Projects completed</div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3>Total Tasks</h3>
                      <TrendingUp className={styles.trendIcon} />
                    </div>
                    <div className={styles.cardValue}>{tasks.length}</div>
                    <div className={styles.cardSubtext}>All tasks</div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3>Avg Progress</h3>
                      <TrendingUp className={styles.trendIcon} />
                    </div>
                    <div className={styles.cardValue}>
                      {projects.length ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0}%
                    </div>
                    <div className={styles.cardSubtext}>Average completion</div>
                  </div>
                </div>

                {/* Charts */}
                <div className={styles.chartsGrid}>
                  {/* Project Status Chart */}
                  <div className={styles.chartCard}>
                    <h3>Project Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={projectStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : null}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {projectStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          formatter={(value, entry) => {
                            const item = projectStatusData.find(d => d.name === value);
                            return `${value}: ${item?.value || 0}`;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Task Status Chart */}
                  <div className={styles.chartCard}>
                    <h3>Task Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={taskStatusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#4F46E5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Priority Distribution */}
                  <div className={styles.chartCard}>
                    <h3>Priority Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={priorityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </ProtectedRoute>
  );
}
