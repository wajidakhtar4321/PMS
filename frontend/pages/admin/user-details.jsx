import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import ViewUserModal from '../../components/ViewUserModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { getAllUsers, updateUser, deleteUser } from '../../utils/api';
import { Users as UsersIcon, Eye, Edit2, Trash2, Search, Filter } from 'lucide-react';
import styles from '../../styles/UserDetails.module.css';

export default function UserDetails() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    isActive: true
  });
  const [editErrors, setEditErrors] = useState({});

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
      setLoading(false);
    }
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

  const confirmDelete = async () => {
    try {
      await deleteUser(userToDelete._id);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) {
          return 'Please enter name.';
        }
        break;
      case 'email':
        if (!value.trim()) {
          return 'Please enter email.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address.';
        }
        break;
      case 'role':
        if (!value) {
          return 'Please select role.';
        }
        break;
      case 'department':
        if (!value.trim()) {
          return 'Please enter department.';
        }
        break;
      default:
        return '';
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors = {};
    const requiredFields = ['name', 'email', 'role', 'department'];
    
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
          role: 'developer',
          department: '',
          isActive: true
        });
      } catch (error) {
        console.error('Error updating user:', error);
      }
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

  const filteredUsers = users.filter(user => {
    // Exclude System Administrator from the list
    if (user.email === 'admin1212@gmail.com') return false;
    
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
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
          <p>Loading user details...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>User Details - Mobiloitte PMS</title>
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
                  User Details
                </h1>
                <p className={styles.pageSubtitle}>
                  Manage all created users - View, Edit, and Delete user accounts
                </p>
              </div>
            </div>

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
                    <th>S.No</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user._id}>
                      <td>
                        <div className={styles.serialNumber}>{index + 1}</div>
                      </td>
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

            <form onSubmit={handleEditSubmit} className={styles.editForm}>
              <div className={styles.formGroup}>
                <label className={styles.required}>Name <span className={styles.asterisk}>*</span></label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  onBlur={handleEditBlur}
                  required
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
                />
                {editErrors.email && <div className={styles.fieldError}>{editErrors.email}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.required}>Role <span className={styles.asterisk}>*</span></label>
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditChange}
                  onBlur={handleEditBlur}
                  required
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
                />
                {editErrors.department && <div className={styles.fieldError}>{editErrors.department}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={editFormData.isActive}
                    onChange={(e) => {
                      setEditFormData({ ...editFormData, isActive: e.target.checked });
                    }}
                  />
                  <span>Active User</span>
                </label>
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
