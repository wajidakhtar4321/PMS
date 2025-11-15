import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from '../styles/AddTaskModal.module.css';

export default function AddTaskModal({ isOpen, onClose, onSubmit, projects = [], users = [], task = null }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    projectId: '',
    assignedTo: '',
    dueDate: '',
  });
  
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        projectId: task.projectId && typeof task.projectId === 'object' ? task.projectId._id : task.projectId || '',
        assignedTo: task.assignedTo && typeof task.assignedTo === 'object' ? task.assignedTo._id : task.assignedTo || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      });
    } else {
      resetForm();
    }
  }, [task, isOpen]);

  const validateField = (name, value) => {
    // Convert value to string if it's not already
    const stringValue = value !== undefined && value !== null ? value.toString() : '';
    
    switch (name) {
      case 'title':
        if (!stringValue.trim()) {
          return 'Please enter task title.';
        }
        // Task Title: ^[a-zA-Z0-9\- ]{3,80}$
        if (!/^[a-zA-Z0-9\- ]{3,80}$/.test(stringValue)) {
          if (stringValue.length < 3) {
            return 'Task title must be at least 3 characters long.';
          } else if (stringValue.length > 80) {
            return 'Task title must be less than 80 characters.';
          } else {
            return 'Task title can only contain letters, numbers, hyphens, and spaces.';
          }
        }
        break;
      case 'description':
        if (!stringValue.trim()) {
          return 'Please enter task description.';
        }
        // Allow all characters but enforce length limits
        if (stringValue.length < 10) {
          return 'Description must be at least 10 characters long.';
        } else if (stringValue.length > 500) {
          return 'Description must be less than 500 characters.';
        }
        break;
      case 'projectId':
        if (!stringValue) {
          return 'Please select project.';
        }
        break;
      case 'assignedTo':
        if (!stringValue) {
          return 'Please select user.';
        }
        break;
      case 'status':
        if (!stringValue) {
          return 'Please select status.';
        }
        break;
        case 'dueDate':
        if (!stringValue) {
          return 'Please select due date.';
        }
        break;
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Apply character limits
    let newValue = value;
    if (name === 'title') {
      // Limit title to 80 characters
      if (value.length > 80) {
        newValue = value.slice(0, 80);
      }
    } else if (name === 'description') {
      // Limit description to 500 characters
      if (value.length > 500) {
        newValue = value.slice(0, 500);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate ALL fields, not just required ones
    const newErrors = {};
    
    // Validate all fields regardless of whether they have values or not
    const allFields = ['title', 'description', 'projectId', 'assignedTo', 'status', 'priority', 'dueDate'];
    
    allFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    setErrors(newErrors);
    
    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      projectId: '',
      assignedTo: '',
      dueDate: ''
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.required}>Title <span className={styles.asterisk}>*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter task title"
            />
            {errors.title && <div className={styles.fieldError}>{errors.title}</div>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.required}>Description <span className={styles.asterisk}>*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter task description"
              rows="3"
            />
            {errors.description && <div className={styles.fieldError}>{errors.description}</div>}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.required}>Project <span className={styles.asterisk}>*</span></label>
              <select 
                name="projectId" 
                value={formData.projectId} 
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select project</option>
                {projects.map(project => (
                  <option key={project._id || project.id} value={project._id || project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              {errors.projectId && <div className={styles.fieldError}>{errors.projectId}</div>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.required}>Assign To <span className={styles.asterisk}>*</span></label>
              <select 
                name="assignedTo" 
                value={formData.assignedTo} 
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select user</option>
                {users.map(user => (
                  <option key={user._id || user.id} value={user._id || user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              {errors.assignedTo && <div className={styles.fieldError}>{errors.assignedTo}</div>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.required}>Status <span className={styles.asterisk}>*</span></label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
              {errors.status && <div className={styles.fieldError}>{errors.status}</div>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.required}>Priority <span className={styles.asterisk}>*</span></label>
              <select 
                name="priority" 
                value={formData.priority} 
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              {errors.priority && <div className={styles.fieldError}>{errors.priority}</div>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.required}>Due Date <span className={styles.asterisk}>*</span></label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              onBlur={handleBlur}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.dueDate && <div className={styles.fieldError}>{errors.dueDate}</div>}
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}