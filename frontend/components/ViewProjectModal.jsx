import { X, Calendar, User, Flag, FileText, DollarSign, Clock, TrendingUp } from 'lucide-react';
import styles from '../styles/ViewProjectModal.module.css';

export default function ViewProjectModal({ isOpen, onClose, project }) {
  if (!isOpen || !project) return null;

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
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Project Details</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          {/* Title */}
          <div className={styles.section}>
            <label className={styles.label}>
              <FileText size={18} />
              Project Name
            </label>
            <h3 className={styles.title}>{project.name}</h3>
          </div>

          {/* Description */}
          {project.description && (
            <div className={styles.section}>
              <label className={styles.label}>Description</label>
              <p className={styles.description}>{project.description}</p>
            </div>
          )}

          {/* Status and Priority */}
          <div className={styles.row}>
            <div className={styles.section}>
              <label className={styles.label}>
                <Clock size={18} />
                Status
              </label>
              <span
                className={styles.badge}
                style={{ backgroundColor: getStatusColor(project.status) }}
              >
                {project.status?.toUpperCase().replace('-', ' ')}
              </span>
            </div>

            <div className={styles.section}>
              <label className={styles.label}>
                <Flag size={18} />
                Priority
              </label>
              <span
                className={styles.badge}
                style={{ backgroundColor: getPriorityColor(project.priority) }}
              >
                {project.priority?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className={styles.section}>
            <label className={styles.label}>
              <TrendingUp size={18} />
              Progress
            </label>
            <div className={styles.progressSection}>
              <div className={styles.progressHeader}>
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
          </div>

          {/* Dates */}
          <div className={styles.row}>
            <div className={styles.section}>
              <label className={styles.label}>
                <Calendar size={18} />
                Start Date
              </label>
              <p className={styles.text}>{formatDate(project.startDate)}</p>
            </div>

            <div className={styles.section}>
              <label className={styles.label}>
                <Calendar size={18} />
                End Date
              </label>
              <p className={styles.text}>{formatDate(project.endDate)}</p>
            </div>
          </div>

          {/* Budget */}
          {project.budget && (
            <div className={styles.section}>
              <label className={styles.label}>
                <DollarSign size={18} />
                Budget
              </label>
              <p className={styles.budgetText}>
                ${parseFloat(project.budget).toLocaleString()}
              </p>
            </div>
          )}

          {/* Assigned User */}
          {(project.assignedTo || project.assignedUser) && (
            <div className={styles.section}>
              <label className={styles.label}>
                <User size={18} />
                Assigned To
              </label>
              <div className={styles.userInfo}>
                <div className={styles.avatar}>
                  {(project.assignedTo?.name || project.assignedUser?.name)?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className={styles.userName}>
                    {project.assignedTo?.name || project.assignedUser?.name}
                  </p>
                  <p className={styles.userEmail}>
                    {project.assignedTo?.email || project.assignedUser?.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Created By */}
          {(project.createdBy || project.creator) && (
            <div className={styles.section}>
              <label className={styles.label}>Created By</label>
              <p className={styles.text}>
                {project.createdBy?.name || project.creator?.name || 'Unknown'}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className={styles.row}>
            <div className={styles.section}>
              <label className={styles.label}>Created At</label>
              <p className={styles.smallText}>{formatDate(project.createdAt)}</p>
            </div>
            {project.updatedAt && (
              <div className={styles.section}>
                <label className={styles.label}>Last Updated</label>
                <p className={styles.smallText}>{formatDate(project.updatedAt)}</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.closeBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
