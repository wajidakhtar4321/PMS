import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';
import ProjectCard from '../components/ProjectCard';
import AddProjectModal from '../components/AddProjectModal';
import ViewProjectModal from '../components/ViewProjectModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { getProjects, createProject, updateProject, deleteProject, getAllUsers } from '../utils/api';
import { Plus, Search, Filter } from 'lucide-react';
import styles from '../styles/Projects.module.css';

export default function Projects() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchProjects();
    fetchUsers();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [searchTerm, statusFilter, projects]);

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
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

  const handleCreateProject = async (projectData) => {
    try {
      if (isEditMode && selectedProject) {
        // Update existing project
        await updateProject(selectedProject._id, projectData);
      } else {
        // Create new project
        await createProject(projectData);
      }
      setIsModalOpen(false);
      setIsEditMode(false);
      setSelectedProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    }
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setIsViewModalOpen(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteProject = (project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProject) return;
    try {
      await deleteProject(selectedProject._id);
      fetchProjects();
      setSelectedProject(null);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const handleAddNewProject = () => {
    setSelectedProject(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedProject(null);
  };

  const filterProjects = () => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Projects - Mobiloitte PMS</title>
        <meta name="description" content="Browse all projects" />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Projects</h1>
              <p className={styles.subtitle}>
                Manage and track all your projects in one place
              </p>
            </div>
            <button className={styles.addButton} onClick={handleAddNewProject}>
              <Plus size={20} />
              New Project
            </button>
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <Filter size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="testing">Testing</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className={styles.projectsGrid}>
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project._id || project.id}
                  project={project}
                  onView={handleViewProject}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p className={styles.emptyText}>
                {searchTerm || statusFilter !== 'all'
                  ? 'No projects found matching your criteria'
                  : 'No projects yet. Create your first project to get started!'}
              </p>
            </div>
          )}

          {/* Stats */}
          {!loading && projects.length > 0 && (
            <div className={styles.stats}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{projects.length}</div>
                <div className={styles.statLabel}>Total Projects</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>
                  {projects.filter(p => p.status === 'in-progress').length}
                </div>
                <div className={styles.statLabel}>In Progress</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>
                  {projects.filter(p => p.status === 'completed').length}
                </div>
                <div className={styles.statLabel}>Completed</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>
                  {Math.round(
                    projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
                  )}%
                </div>
                <div className={styles.statLabel}>Avg Progress</div>
              </div>
            </div>
          )}
        </div>
      </main>

      <AddProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateProject}
        users={users}
        project={isEditMode ? selectedProject : null}
      />

      <ViewProjectModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedProject(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${selectedProject?.name}"?`}
        confirmText="Yes"
        cancelText="No"
        type="danger"
      />

      <Footer />
    </ProtectedRoute>
  );
}
