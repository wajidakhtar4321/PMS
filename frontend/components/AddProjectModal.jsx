import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from '../styles/AddProjectModal.module.css';

export default function AddProjectModal({ isOpen, onClose, onSubmit, users = [], project = null }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: '',
    priority: '',
    progress: 0,
    startDate: '',
    endDate: '',
    budget: '',
    assignedTo: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({}); // Track which fields have been touched

  // Populate form when editing
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'planning',
        priority: project.priority || 'medium',
        progress: project.progress || 0,
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
        budget: project.budget !== undefined ? project.budget.toString() : '',
        assignedTo: typeof project.assignedTo === 'object' ? project.assignedTo._id : project.assignedTo || ''
      });
    } else {
      resetForm();
    }
  }, [project, isOpen]);

  const validateField = (name, value) => {
    // Convert value to string if it's not already
    const stringValue = value !== undefined && value !== null ? value.toString() : '';
    
    switch (name) {
      case 'name':
        if (!stringValue.trim()) {
          return 'Please enter project name.';
        }
        // Project Name: ^[a-zA-Z0-9\- ]{3,80}$
        if (!/^[a-zA-Z0-9\- ]{3,80}$/.test(stringValue)) {
          if (stringValue.length < 3) {
            return 'Project name must be at least 3 characters long.';
          } else if (stringValue.length > 80) {
            return 'Project name must be less than 80 characters.';
          } else {
            return 'Project name can only contain letters, numbers, hyphens, and spaces.';
          }
        }
        break;
      case 'description':
        if (!stringValue.trim()) {
          return 'Please enter description.';
        }
        // Allow all characters but enforce length limits
        if (stringValue.length < 10) {
          return 'Description must be at least 10 characters long.';
        } else if (stringValue.length > 500) {
          return 'Description must be less than 500 characters.';
        }
        break;
      case 'startDate':
         if (!stringValue.trim()) {
          return 'Please select start date.';
        }
        if (stringValue && formData.endDate && new Date(stringValue) > new Date(formData.endDate)) {
          return 'Start date cannot be after end date.';
        }
        break;
      case 'endDate':
         if (!stringValue.trim()) {
          return 'Please select end date.';
        }
        if (stringValue && formData.startDate && new Date(stringValue) < new Date(formData.startDate)) {
          return 'End date cannot be before start date.';
        }
        break;
      case 'budget':
         if (!stringValue.trim()) {
          return 'Please enter budget.';
        }
        if (stringValue && (isNaN(stringValue) || parseFloat(stringValue) < 0)) {
          return 'Budget must be a positive number.';
        }
        if (stringValue && parseFloat(stringValue) > 10000000) {
          return 'Budget cannot exceed $10,000,000.';
        }
        break;
      case 'assignedTo':
        if (!stringValue) {
          return 'Please select user.';
        }
        break;
      case 'status':
        if (!stringValue || stringValue === '') {
          return 'Please select status.';
        }
        break;
      case 'priority':
        if (!stringValue || stringValue === '') {
          return 'Please select priority.';
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
    if (name === 'name') {
      // Limit name to 80 characters
      if (value.length > 80) {
        newValue = value.slice(0, 80);
      }
    } else if (name === 'description') {
      // Limit description to 500 characters
      if (value.length > 500) {
        newValue = value.slice(0, 500);
      }
    } else if (name === 'budget') {
      // Ensure budget is a valid number
      if (value && (isNaN(value) || parseFloat(value) < 0)) {
        return;
      }
      // Limit budget to reasonable amount
      if (value && parseFloat(value) > 10000000) {
        newValue = '10000000';
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
    
    // Re-validate related fields
    if (name === 'startDate' && formData.endDate) {
      const endDateError = validateField('endDate', formData.endDate);
      if (endDateError) {
        setErrors(prev => ({
          ...prev,
          endDate: endDateError
        }));
      } else if (errors.endDate) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.endDate;
          return newErrors;
        });
      }
    } else if (name === 'endDate' && formData.startDate) {
      const startDateError = validateField('startDate', formData.startDate);
      if (startDateError) {
        setErrors(prev => ({
          ...prev,
          startDate: startDateError
        }));
      } else if (errors.startDate) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.startDate;
          return newErrors;
        });
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field only if it has been touched
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
    
    // Mark all fields as touched for validation
    const allTouched = {};
    Object.keys(formData).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    // Validate ALL fields, not just required ones
    const newErrors = {};
    
    // Validate all fields regardless of whether they have values or not
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    // Check date consistency
    if (formData.startDate && formData.endDate) {
      const startDateError = validateField('startDate', formData.startDate);
      const endDateError = validateField('endDate', formData.endDate);
      if (startDateError) newErrors.startDate = startDateError;
      if (endDateError) newErrors.endDate = endDateError;
    }
    
    setErrors(newErrors);
    
    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      // Format budget to fixed 2 decimal places if it's a valid number
      const formattedData = { ...formData };
      if (formattedData.budget && !isNaN(formattedData.budget)) {
        formattedData.budget = parseFloat(formattedData.budget).toFixed(2);
      }
      onSubmit(formattedData);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: '',
      priority: '',
      progress: 0,
      startDate: '',
      endDate: '',
      budget: '',
      assignedTo: ''
    });
    setErrors({});
    setTouched({}); // Reset touched state
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{project ? 'Edit Project' : 'Create New Project'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.required}>Project Name <span className={styles.asterisk}>*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter project name"
            />
            {touched.name && errors.name && <div className={styles.fieldError}>{errors.name}</div>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.required}>Description <span className={styles.asterisk}>*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter project description"
              rows="4"
            />
            {touched.description && errors.description && <div className={styles.fieldError}>{errors.description}</div>}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.required}>Status <span className={styles.asterisk}>*</span></label>
              <select name="status" value={formData.status} onChange={handleChange} onBlur={handleBlur}>
                <option value="">Select status</option>
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="testing">Testing</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
              {touched.status && errors.status && <div className={styles.fieldError}>{errors.status}</div>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.required}>Priority <span className={styles.asterisk}>*</span></label>
              <select name="priority" value={formData.priority} onChange={handleChange} onBlur={handleBlur}>
                <option value="">Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              {touched.priority && errors.priority && <div className={styles.fieldError}>{errors.priority}</div>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.required}>Start Date <span className={styles.asterisk}>*</span></label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.startDate && errors.startDate && <div className={styles.fieldError}>{errors.startDate}</div>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.required}>End Date <span className={styles.asterisk}>*</span></label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.endDate && errors.endDate && <div className={styles.fieldError}>{errors.endDate}</div>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.required}>Budget (USD) <span className={styles.asterisk}>*</span></label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {touched.budget && errors.budget && <div className={styles.fieldError}>{errors.budget}</div>}
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
                  <option key={user._id || user.id} value={user._id || user.id}>{user.name}</option>
                ))}
              </select>
              {touched.assignedTo && errors.assignedTo && <div className={styles.fieldError}>{errors.assignedTo}</div>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.progressLabel}>Progress: {formData.progress}%</label>
            <input
              type="range"
              name="progress"
              value={formData.progress}
              onChange={handleChange}
              min="0"
              max="100"
              step="5"
              className={styles.progressSlider}
            />
            <div className={styles.progressDisplay}>
              <span className={styles.progressValue}>{formData.progress}%</span>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              {project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}