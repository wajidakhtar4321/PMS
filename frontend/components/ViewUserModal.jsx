import { X, Mail, User, Briefcase, Shield, Calendar, CheckCircle, XCircle } from 'lucide-react';
import styles from '../styles/Modal.module.css';

export default function ViewUserModal({ isOpen, onClose, user }) {
  if (!isOpen || !user) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return '#7C3AED';
      case 'manager':
        return '#3B82F6';
      case 'developer':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <User size={24} />
            User Details
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* User Avatar */}
          <div className={styles.userAvatar}>
            <div className={styles.avatarCircle}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h3 className={styles.userName}>{user.name}</h3>
            <span 
              className={styles.roleBadge} 
              style={{ background: getRoleBadgeColor(user.role) }}
            >
              {user.role}
            </span>
          </div>

          {/* User Information */}
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <Mail size={18} />
                Email Address
              </div>
              <div className={styles.infoValue}>{user.email}</div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <Briefcase size={18} />
                Department
              </div>
              <div className={styles.infoValue}>
                {user.department || 'Not specified'}
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <Shield size={18} />
                Role
              </div>
              <div className={styles.infoValue} style={{ textTransform: 'capitalize' }}>
                {user.role}
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                {user.isActive ? <CheckCircle size={18} /> : <XCircle size={18} />}
                Status
              </div>
              <div className={styles.infoValue}>
                <span className={`${styles.statusBadge} ${user.isActive ? styles.active : styles.inactive}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <Calendar size={18} />
                Created At
              </div>
              <div className={styles.infoValue}>
                {formatDate(user.createdAt)}
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <Calendar size={18} />
                Last Updated
              </div>
              <div className={styles.infoValue}>
                {formatDate(user.updatedAt)}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.secondaryButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
