import { Calendar, User, TrendingUp, Clock, Eye, Edit2, Trash2 } from 'lucide-react';
import styles from '../styles/ProjectCard.module.css';

export default function ProjectCard({ project, onView, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    const colors = {
      'planning': '#6B7280',
      'in-progress': '#3B82F6',
      'testing': '#F59E0B',
      'completed': '#10B981',
      'on-hold': '#EF4444'
    };
    return colors[status] || '#6B7280';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': '#10B981',
      'medium': '#F59E0B',
      'high': '#EF4444',
      'critical': '#DC2626'
    };
    return colors[priority] || '#6B7280';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.header}>
          <h3 className={styles.title}>{project.name}</h3>
          <div className={styles.badges}>
            <span 
              className={styles.badge}
              style={{ backgroundColor: getStatusColor(project.status) }}
            >
              {project.status}
            </span>
            <span 
              className={styles.badge}
              style={{ backgroundColor: getPriorityColor(project.priority) }}
            >
              {project.priority}
            </span>
          </div>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation();
              onView && onView(project);
            }}
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button
            className={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation();
              onEdit && onEdit(project);
            }}
            title="Edit Project"
          >
            <Edit2 size={18} />
          </button>
          <button
            className={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete(project);
            }}
            title="Delete Project"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <p className={styles.description}>
        {project.description || 'No description available'}
      </p>

      <div className={styles.info}>
        <div className={styles.infoItem}>
          <User size={16} />
          <span>{project.assignedUser?.name || 'Unassigned'}</span>
        </div>
        <div className={styles.infoItem}>
          <Calendar size={16} />
          <span>{formatDate(project.startDate)}</span>
        </div>
        {project.endDate && (
          <div className={styles.infoItem}>
            <Clock size={16} />
            <span>Due: {formatDate(project.endDate)}</span>
          </div>
        )}
      </div>

      <div className={styles.progress}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Progress</span>
          <span className={styles.progressValue}>{project.progress}%</span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ 
              width: `${project.progress}%`,
              backgroundColor: project.progress === 100 ? '#10B981' : '#3B82F6'
            }}
          />
        </div>
      </div>

      {project.budget && (
        <div className={styles.budget}>
          <TrendingUp size={16} />
          <span>Budget: ${parseFloat(project.budget).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
