import { X, Calendar, User, Flag, FileText, Clock } from 'lucide-react';
import styles from '../styles/ViewTaskModal.module.css';

export default function ViewTaskModal({ isOpen, onClose, task }) {
  if (!isOpen || !task) return null;

  const getStatusColor = (status) => {
    const colors = {
      'todo': '#6B7280',
      'in-progress': '#3B82F6',
      'review': '#F59E0B',
      'done': '#10B981'
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
          <h2>Task Details</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          {/* Title */}
          <div className={styles.section}>
            <label className={styles.label}>
              <FileText size={18} />
              Task Title
            </label>
            <h3 className={styles.title}>{task.title}</h3>
          </div>

          {/* Description */}
          {task.description && (
            <div className={styles.section}>
              <label className={styles.label}>Description</label>
              <p className={styles.description}>{task.description}</p>
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
                style={{ backgroundColor: getStatusColor(task.status) }}
              >
                {task.status?.replace('-', ' ').toUpperCase()}
              </span>
            </div>

            <div className={styles.section}>
              <label className={styles.label}>
                <Flag size={18} />
                Priority
              </label>
              <span
                className={styles.badge}
                style={{ backgroundColor: getPriorityColor(task.priority) }}
              >
                {task.priority?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Due Date */}
          <div className={styles.section}>
            <label className={styles.label}>
              <Calendar size={18} />
              Due Date
            </label>
            <p className={styles.text}>{formatDate(task.dueDate)}</p>
          </div>

          {/* Assigned User */}
          {task.assignedTo && (
            <div className={styles.section}>
              <label className={styles.label}>
                <User size={18} />
                Assigned To
              </label>
              <div className={styles.userInfo}>
                <div className={styles.avatar}>
                  {task.assignedTo.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className={styles.userName}>{task.assignedTo.name}</p>
                  <p className={styles.userEmail}>{task.assignedTo.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Project */}
          {task.projectId && (
            <div className={styles.section}>
              <label className={styles.label}>Project</label>
              <p className={styles.text}>
                {typeof task.projectId === 'object' ? task.projectId.name : task.projectId}
              </p>
            </div>
          )}

          {/* Created By */}
          {task.createdBy && (
            <div className={styles.section}>
              <label className={styles.label}>Created By</label>
              <p className={styles.text}>{task.createdBy.name}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className={styles.row}>
            <div className={styles.section}>
              <label className={styles.label}>Created At</label>
              <p className={styles.smallText}>{formatDate(task.createdAt)}</p>
            </div>
            {task.updatedAt && (
              <div className={styles.section}>
                <label className={styles.label}>Last Updated</label>
                <p className={styles.smallText}>{formatDate(task.updatedAt)}</p>
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
