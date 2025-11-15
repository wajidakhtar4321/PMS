import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import AddTaskModal from '../../components/AddTaskModal';
import ViewTaskModal from '../../components/ViewTaskModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { getTasks, createTask, updateTask, deleteTask, getProjects, getAllUsers } from '../../utils/api';
import { Plus, Search, Filter, Edit, Trash2, CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react';
import styles from '../../styles/Tasks.module.css';

export default function Tasks() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

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
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        getTasks({}),
        getProjects(),
        getAllUsers()
      ]);
      setTasks(tasksRes.data.data || []);
      setProjects(projectsRes.data.data || []);
      setUsers(usersRes.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateTask = async (taskData) => {
    try {
      if (isEditMode && selectedTask) {
        // Update existing task
        await updateTask(selectedTask._id, taskData);
      } else {
        // Create new task
        await createTask(taskData);
      }
      setIsModalOpen(false);
      setIsEditMode(false);
      setSelectedTask(null);
      fetchData();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task. Please try again.');
    }
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (task) => {
    setSelectedTask(task);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedTask) return;
    try {
      await deleteTask(selectedTask._id);
      fetchData();
      setSelectedTask(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleAddNewTask = () => {
    setSelectedTask(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedTask(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done': return <CheckCircle size={18} />;
      case 'in-progress': return <Clock size={18} />;
      case 'review': return <AlertCircle size={18} />;
      default: return <Clock size={18} />;
    }
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Tasks - Mobiloitte PMS</title>
      </Head>

      <Header />

      <div className={styles.layout}>
        <Sidebar />

        <main className={styles.mainContent}>
          <div className={styles.container}>
            <div className={styles.header}>
              <div>
                <h1 className={styles.title}>Tasks</h1>
                <p className={styles.subtitle}>Manage and track all your tasks</p>
              </div>
              <button className={styles.addButton} onClick={handleAddNewTask}>
                <Plus size={20} />
                New Task
              </button>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
              <div className={styles.searchBox}>
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className={styles.filterGroup}>
                <Filter size={20} />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
                <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Tasks List */}
            {loading ? (
              <div className={styles.loading}>Loading tasks...</div>
            ) : (
              <div className={styles.tasksList}>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <div key={task._id} className={styles.taskCard}>
                      <div className={styles.taskHeader}>
                        <h3>{task.title}</h3>
                        <div className={styles.taskActions}>
                          <button 
                            className={styles.iconButton}
                            onClick={() => handleViewTask(task)}
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            className={styles.iconButton}
                            onClick={() => handleEditTask(task)}
                            title="Edit Task"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            className={styles.iconButton}
                            onClick={() => handleDeleteTask(task)}
                            title="Delete Task"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <p className={styles.taskDescription}>{task.description}</p>
                      <div className={styles.taskMeta}>
                        <span className={`${styles.badge} ${styles[task.status]}`}>
                          {getStatusIcon(task.status)}
                          {task.status}
                        </span>
                        <span className={`${styles.badge} ${styles[task.priority]}`}>
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className={styles.dueDate}>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.empty}>
                    <p>No tasks found. Create your first task to get started!</p>
                  </div>
                )}
              </div>
            )}

            {/* Stats */}
            {!loading && tasks.length > 0 && (
              <div className={styles.stats}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{tasks.length}</div>
                  <div className={styles.statLabel}>Total Tasks</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>
                    {tasks.filter(t => t.status === 'done').length}
                  </div>
                  <div className={styles.statLabel}>Completed</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>
                    {tasks.filter(t => t.status === 'in-progress').length}
                  </div>
                  <div className={styles.statLabel}>In Progress</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>
                    {tasks.filter(t => t.priority === 'high' || t.priority === 'critical').length}
                  </div>
                  <div className={styles.statLabel}>High Priority</div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateTask}
        projects={projects}
        users={users}
        task={isEditMode ? selectedTask : null}
      />

      <ViewTaskModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedTask(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${selectedTask?.title}"?`}
        confirmText="Yes"
        cancelText="No"
        type="danger"
      />

      <Footer />
    </ProtectedRoute>
  );
}
