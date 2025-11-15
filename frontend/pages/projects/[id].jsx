import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/ProtectedRoute';
import KanbanBoard from '../../components/KanbanBoard';
import AddTaskModal from '../../components/AddTaskModal';
import ViewTaskModal from '../../components/ViewTaskModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { getProjectById, getCommentsByProject, createComment, getTasks, createTask, updateTask, deleteTask, getAllUsers } from '../../utils/api';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  User,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  Send
} from 'lucide-react';
import styles from '../../styles/ProjectDetails.module.css';

export default function ProjectDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
      fetchTasks();
      fetchComments();
      fetchUsers();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await getProjectById(id);
      setProject(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project:', error);
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await getTasks({ projectId: id });
      setTasks(response.data.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getCommentsByProject(id);
      setComments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setCommentError('Please enter a comment.');
      return;
    }
    
    setCommentError('');
    
    try {
      await addComment(projectId, { content: newComment });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const dataWithProject = { ...taskData, projectId: id };
      if (isEditMode && selectedTask) {
        await updateTask(selectedTask._id, dataWithProject);
      } else {
        await createTask(dataWithProject);
      }
      setIsTaskModalOpen(false);
      setIsEditMode(false);
      setSelectedTask(null);
      fetchTasks();
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
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (task) => {
    setSelectedTask(task);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedTask) return;
    try {
      await deleteTask(selectedTask._id);
      fetchTasks();
      setSelectedTask(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleAddNewTask = () => {
    setSelectedTask(null);
    setIsEditMode(false);
    setIsTaskModalOpen(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color="#10B981" />;
      case 'in-progress':
        return <Clock size={20} color="#3B82F6" />;
      default:
        return <AlertCircle size={20} color="#F59E0B" />;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Header />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading project details...</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (!project) {
    return (
      <ProtectedRoute>
        <Header />
        <div className={styles.notFound}>
          <h2>Project not found</h2>
          <button onClick={() => router.push('/projects')}>Back to Projects</button>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>{project.name} - Mobiloitte PMS</title>
        <meta name="description" content="Project Details" />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.pageHeader}>
            <button className={styles.backButton} onClick={() => router.push('/projects')}>
              <ArrowLeft size={20} />
              Back to Projects
            </button>
            <div className={styles.headerContent}>
              <div>
                <h1 className={styles.projectTitle}>{project.name}</h1>
                <p className={styles.projectDescription}>{project.description}</p>
              </div>
              <div className={styles.headerActions}>
                <span className={`${styles.statusBadge} ${styles[project.status]}`}>
                  {getStatusIcon(project.status)}
                  {project.status}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ backgroundColor: '#EEF2FF' }}>
                <User size={24} color="#4F46E5" />
              </div>
              <div>
                <p className={styles.statLabel}>Assigned To</p>
                <p className={styles.statValue}>
                  {project.assignedUser?.name || 'Unassigned'}
                </p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ backgroundColor: '#FEF3C7' }}>
                <Calendar size={24} color="#F59E0B" />
              </div>
              <div>
                <p className={styles.statLabel}>Due Date</p>
                <p className={styles.statValue}>
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString()
                    : 'Not set'}
                </p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ backgroundColor: '#D1FAE5' }}>
                <CheckCircle size={24} color="#10B981" />
              </div>
              <div>
                <p className={styles.statLabel}>Progress</p>
                <p className={styles.statValue}>{project.progress}%</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ backgroundColor: '#FEE2E2' }}>
                <DollarSign size={24} color="#EF4444" />
              </div>
              <div>
                <p className={styles.statLabel}>Budget</p>
                <p className={styles.statValue}>
                  ${project.budget ? parseFloat(project.budget).toLocaleString() : '0'}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span>Overall Progress</span>
              <span className={styles.progressValue}>{project.progress}%</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${project.progress}%`,
                  backgroundColor: project.progress === 100 ? '#10B981' : '#4F46E5'
                }}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'overview' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'tasks' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              Tasks ({tasks.length})
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'team' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('team')}
            >
              Team
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'comments' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              Comments ({comments.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <div className={styles.overview}>
                <div className={styles.section}>
                  <h3>Project Information</h3>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Start Date:</span>
                      <span className={styles.value}>
                        {project.startDate
                          ? new Date(project.startDate).toLocaleDateString()
                          : 'Not set'}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>End Date:</span>
                      <span className={styles.value}>
                        {project.endDate
                          ? new Date(project.endDate).toLocaleDateString()
                          : 'Not set'}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Priority:</span>
                      <span className={`${styles.priorityBadge} ${styles[project.priority]}`}>
                        {project.priority}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Created By:</span>
                      <span className={styles.value}>
                        {project.creator?.name || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className={styles.tasksSection}>
                <KanbanBoard
                  tasks={tasks}
                  onAddTask={handleAddNewTask}
                  onViewTask={handleViewTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
              </div>
            )}

            {activeTab === 'team' && (
              <div className={styles.teamSection}>
                <div className={styles.teamMember}>
                  <div className={styles.memberAvatar}>
                    {project.assignedUser?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.memberInfo}>
                    <h4>{project.assignedUser?.name || 'Unassigned'}</h4>
                    <p>{project.assignedUser?.email}</p>
                    <span className={styles.memberRole}>Project Lead</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className={styles.commentsSection}>
                <form onSubmit={handleAddComment} className={styles.commentForm}>
                  <textarea
                    value={newComment}
                    onChange={(e) => {
                      setNewComment(e.target.value);
                      if (commentError) setCommentError('');
                    }}
                    placeholder="Add a comment..."
                    rows="3"
                  />
                  {commentError && <div className={styles.fieldError}>{commentError}</div>}
                  <button type="submit" className={styles.sendButton}>
                    <Send size={18} />
                    Post Comment
                  </button>
                </form>

                <div className={styles.commentsList}>
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className={styles.comment}>
                        <div className={styles.commentAvatar}>
                          {comment.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.commentContent}>
                          <div className={styles.commentHeader}>
                            <strong>{comment.user?.name}</strong>
                            <span className={styles.commentDate}>
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p>{comment.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyState}>
                      <MessageSquare size={48} color="#d1d5db" />
                      <p>No comments yet. Be the first to comment!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <AddTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setIsEditMode(false);
          setSelectedTask(null);
        }}
        onSubmit={handleCreateTask}
        projects={[project]}
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
