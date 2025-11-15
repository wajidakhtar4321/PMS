import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import ProtectedRoute from '../components/ProtectedRoute';
import ViewUserModal from '../components/ViewUserModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { getAllUsers, updateUser, deleteUser, registerUser } from '../utils/api';
import { 
  Search, 
  UserPlus, 
  Edit2, 
  Trash2, 
  EyeOff, 
  Eye,
  Filter, 
  ChevronDown, 
  MessageSquare, 
  Send,
  User,
  Users as UsersIcon,
  UserCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import styles from '../styles/Users.module.css';

export default function Users() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // New state for create modal
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    isActive: true
  });
  // New state for create form data
  const [createFormData, setCreateFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    department: ''
  });
  // Comment section state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('users'); // Add tab state

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    setCurrentUser(user);

    // Only admin can access this page
    if (user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      // Filter out System Administrator
      const allUsers = response.data.data || [];
      const regularUsers = allUsers.filter(user => user.email !== 'admin1212@gmail.com');
      setUsers(regularUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users. Please try again.');
      setLoading(false);
    }
  };

  const [commentError, setCommentError] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setCommentError('Please enter a comment.');
      return;
    }
    
    setCommentError('');
    
    try {
      // Add comment logic here
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || '',
      isActive: user.isActive
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenCreateModal = () => {
    // Reset form data when opening create modal
    setCreateFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      department: ''
    });
    // Clear any existing errors
    setCreateErrors({});
    setIsCreateModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(userToDelete._id);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.message || 'Failed to delete user. Please try again.');
    }
  };

  const [editErrors, setEditErrors] = useState({});

  const validateField = (name, value, isCreate = false) => {
    switch (name) {
      case 'name':
        if (!value.trim()) {
          return 'Please enter your full name.';
        }
        if (value.trim().length < 2) {
          return 'Name must be at least 2 characters';
        }
        if (value.trim().length > 70) {
          return 'Name must be less than 70 character.';
        }
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          return 'Name can only contain letters and spaces.';
        }
        break;
      case 'email':
        if (!value.trim()) {
          return 'Please enter your email address.';
        }
        if (value.trim().length > 50) {
          return 'Email must be less than 50 characters.';
        }
        // Comprehensive email validation like login page
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Please enter a valid email address';
        }
        break;
      case 'role':
        if (!value) {
          return 'Please select a role.';
        }
        break;
      case 'password':
        if (isCreate && !value) {
          return 'Please enter password.';
        }
        if (isCreate && value.length < 8) {
          return 'Password must be at least 8 characters.';
        }
        if (isCreate && value.length > 70) {
          return 'Password must be less than 70 characters.';
        }
        if (isCreate && !/(?=.*[a-z])/.test(value)) {
          return 'Password must contain at least one lowercase letter.';
        }
        if (isCreate && !/(?=.*[A-Z])/.test(value)) {
          return 'Password must contain at least one uppercase letter.';
        }
        if (isCreate && !/(?=.*\d)/.test(value)) {
          return 'Password must contain at least one number.';
        }
        if (isCreate && !/(?=.*[@$!%*?&])/.test(value)) {
          return 'Password must contain at least one special character (@$!%*?&).';
        }
        break;
      case 'confirmPassword':
        if (isCreate && !value) {
          return 'Please enter confirm password.';
        }
        if (isCreate && value !== createFormData.password) {
          return 'Passwords do not match.';
        }
        break;
      case 'department':
        if (!value.trim()) {
          return 'Please enter your department.';
        }
        if (value && value.trim().length > 50) {
          return 'Department must be less than 50 characters.';
        }
        if (value && value.trim().length < 2 && value.trim().length > 0) {
          return 'Department must be at least 2 characters.';
        }
        break;
      default:
        return '';
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (editErrors[name]) {
      setEditErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleEditBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setEditErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors = {};
    const requiredFields = ['name', 'email', 'role'];
    
    requiredFields.forEach(field => {
      const error = validateField(field, editFormData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    setEditErrors(newErrors);
    
    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      try {
        await updateUser(selectedUser._id, editFormData);
        setIsEditModalOpen(false);
        fetchUsers();
        setEditFormData({
          name: '',
          email: '',
          role: '',
          department: '',
          isActive: true
        });
      } catch (error) {
        console.error('Error updating user:', error);
        alert('Failed to update user. Please try again.');
      }
    }
  };

  // New functions for create user modal
  const [createErrors, setCreateErrors] = useState({});

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (createErrors[name]) {
      setCreateErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCreateBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value, true);
    if (error) {
      setCreateErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    
    // Validate ALL fields, not just required ones
    const newErrors = {};
    
    // Validate all fields regardless of whether they have values or not
    const allFields = ['name', 'email', 'password', 'confirmPassword', 'role', 'department'];
    
    allFields.forEach(field => {
      const error = validateField(field, createFormData[field], true);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    setCreateErrors(newErrors);
    
    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      try {
        await registerUser(createFormData);
        setIsCreateModalOpen(false);
        fetchUsers();
        // Reset form
        setCreateFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: '',
          department: ''
        });
      } catch (error) {
        console.error('Error creating user:', error);
        alert(error.response?.data?.message || 'Failed to create user. Please try again.');
      }
    }
  };

  const filteredUsers = users.filter(user => {
    // Exclude System Administrator from the list
    if (user.email === 'admin1212@gmail.com') return false;
    
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

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

  if (loading) {
    return (
      <ProtectedRoute>
        <Header />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading users...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Users Management - Mobiloitte PMS</title>
        <meta name="description" content="Manage system users" />
      </Head>

      <Header />

      <div className={styles.usersLayout}>
        <Sidebar />

        <main className={styles.mainContent}>
          <div className={styles.container}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>
                  <UsersIcon size={32} />
                  Users Management
                </h1>
                <p className={styles.pageSubtitle}>
                  Manage all created users - View, Edit, and Delete user accounts
                </p>
              </div>
              <button 
                className={styles.createBtn}
                onClick={handleOpenCreateModal}
              >
                <UserPlus size={20} />
                Create New User
              </button>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'users' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('users')}
              >
                Users ({users.length})
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'comments' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('comments')}
              >
                Comments ({comments.length})
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'users' && (
              <>
                {/* Search and Filter */}
                <div className={styles.filterSection}>
                  <div className={styles.searchBox}>
                    <Search size={20} />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>

                  <div className={styles.filterBox}>
                    <Filter size={20} />
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="developer">Developer</option>
                    </select>
                  </div>
                </div>

                {/* Users Stats */}
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>{users.length}</div>
                    <div className={styles.statLabel}>Created Users</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>
                      {users.filter(u => u.role === 'admin' && u.email !== 'admin1212@gmail.com').length}
                    </div>
                    <div className={styles.statLabel}>Admin Users</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>
                      {users.filter(u => u.role === 'manager').length}
                    </div>
                    <div className={styles.statLabel}>Managers</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>
                      {users.filter(u => u.role === 'developer').length}
                    </div>
                    <div className={styles.statLabel}>Developers</div>
                  </div>
                </div>

                {/* Users Table */}
                <div className={styles.tableContainer}>
                  <table className={styles.usersTable}>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user._id}>
                          <td>
                            <div className={styles.userCell}>
                              <div className={styles.userAvatar}>
                                {user.name?.charAt(0).toUpperCase()}
                              </div>
                              <span className={styles.userName}>{user.name}</span>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span 
                              className={styles.roleBadge}
                              style={{ background: getRoleBadgeColor(user.role) }}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td>{user.department || '-'}</td>
                          <td>
                            <span className={`${styles.statusBadge} ${user.isActive ? styles.active : styles.inactive}`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actionButtons}>
                              {/* Hide action buttons for System Administrator */}
                              {user.email !== 'admin1212@gmail.com' && (
                                <>
                                  <button
                                    className={`${styles.actionBtn} ${styles.viewBtn}`}
                                    onClick={() => handleViewUser(user)}
                                    title="View Details"
                                  >
                                    <Eye size={18} />
                                  </button>
                                  <button
                                    className={`${styles.actionBtn} ${styles.editBtn}`}
                                    onClick={() => handleEditUser(user)}
                                    title="Edit User"
                                  >
                                    <Edit2 size={18} />
                                  </button>
                                  {user.role !== 'admin' && (
                                    <button
                                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                      onClick={() => handleDeleteUser(user)}
                                      title="Delete User"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredUsers.length === 0 && (
                    <div className={styles.emptyState}>
                      <UsersIcon size={48} />
                      <p>No users found</p>
                    </div>
                  )}
                </div>
              </>
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
                    placeholder="Add a comment about user management..."
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
                              {formatDate(comment.createdAt)}
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
        </main>
      </div>

      {/* View User Modal */}
      <ViewUserModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsEditModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <Edit2 size={24} />
                Edit User
              </h2>
              <button className={styles.closeButton} onClick={() => setIsEditModalOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className={styles.editForm} noValidate>
              <div className={styles.formGroup}>
                <label className={styles.required}>Name <span className={styles.asterisk}>*</span></label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  onBlur={handleEditBlur}
                  maxLength="70"
                />
                {editErrors.name && <div className={styles.fieldError}>{editErrors.name}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.required}>Email <span className={styles.asterisk}>*</span></label>
                <input
                  type="text"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  onBlur={handleEditBlur}
                  maxLength="100"
                />
                {editErrors.email && <div className={styles.fieldError}>{editErrors.email}</div>}
              </div>

              <div className={`${styles.formGroup} ${styles.roleDropdownContainer}`}>
                <label className={styles.required}>Role <span className={styles.asterisk}>*</span></label>
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditChange}
                  onBlur={handleEditBlur}
                  className={styles.roleSelect}
                >
                  <option value="developer">Developer</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                {editErrors.role && <div className={styles.fieldError}>{editErrors.role}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.required}>Department <span className={styles.asterisk}>*</span></label>
                <input
                  type="text"
                  name="department"
                  value={editFormData.department}
                  onChange={handleEditChange}
                  onBlur={handleEditBlur}
                  maxLength="50"
                />
                {editErrors.department && <div className={styles.fieldError}>{editErrors.department}</div>}
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.secondaryButton} onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryButton}>
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsCreateModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <UserPlus size={24} />
                Create New User
              </h2>
              <button className={styles.closeButton} onClick={() => setIsCreateModalOpen(false)}>
                ×
              </button>
            </div>

            <form id="createUserForm" onSubmit={handleCreateSubmit} className={styles.editForm} noValidate>
              <div className={styles.formGroup}>
                <label className={styles.required}>Name <span className={styles.asterisk}>*</span></label>
                <input
                  type="text"
                  name="name"
                  value={createFormData.name}
                  onChange={handleCreateChange}
                  onBlur={handleCreateBlur}
                  placeholder="Enter full name"
                  maxLength="70"
                  required
                />
                {createErrors.name && <div className={styles.fieldError}>{createErrors.name}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.required}>Email <span className={styles.asterisk}>*</span></label>
                <input
                  type="text"
                  name="email"
                  value={createFormData.email}
                  onChange={handleCreateChange}
                  onBlur={handleCreateBlur}
                  placeholder="Enter email address"
                  maxLength="100"
                />
                {createErrors.email && <div className={styles.fieldError}>{createErrors.email}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.required}>Password <span className={styles.asterisk}>*</span></label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={createFormData.password}
                    onChange={handleCreateChange}
                    onBlur={handleCreateBlur}
                    placeholder="Enter password"
                    maxLength="70"
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                {createErrors.password && <div className={styles.fieldError}>{createErrors.password}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.required}>Confirm Password <span className={styles.asterisk}>*</span></label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={createFormData.confirmPassword}
                    onChange={handleCreateChange}
                    onBlur={handleCreateBlur}
                    placeholder="Confirm password"
                    maxLength="70"
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                {createErrors.confirmPassword && <div className={styles.fieldError}>{createErrors.confirmPassword}</div>}
              </div>

              <div className={styles.formRow}>
                <div className={`${styles.formGroup} ${styles.roleDropdownContainer}`}>
                  <label className={styles.required} htmlFor="role">Role <span className={styles.asterisk}>*</span></label>
                  <select
                    id="role"
                    name="role"
                    value={createFormData.role}
                    onChange={handleCreateChange}
                    onBlur={handleCreateBlur}
                    required
                    className={styles.roleSelect}
                  >
                    <option value="">Select Role</option>
                    <option value="developer">Developer</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  {createErrors.role && <div className={styles.fieldError}>{createErrors.role}</div>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.required} htmlFor="department">Department <span className={styles.asterisk}>*</span></label>
                  <input
                    id="department"
                    type="text"
                    name="department"
                    value={createFormData.department}
                    onChange={handleCreateChange}
                    onBlur={handleCreateBlur}
                    placeholder="Enter department"
                    maxLength="50"
                    required
                  />
                  {createErrors.department && <div className={styles.fieldError}>{createErrors.department}</div>}
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.secondaryButton} onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryButton}>
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name}?`}
        onConfirm={confirmDelete}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setUserToDelete(null);
        }}
        confirmText="Yes"
        cancelText="No"
      />

      <Footer />
    </ProtectedRoute>
  );
}