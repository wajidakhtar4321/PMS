import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { updateProfile, changePassword } from '../../utils/api';
import { User, Mail, Globe, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import styles from '../../styles/Settings.module.css';

export default function Settings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    department: '',
    role: 'developer'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    taskAssignments: true
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        department: user.department || '',
        role: user.role || 'developer'
      });
    }
  }, []);

  const validateProfileField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) {
          return 'Please enter your name.';
        }
        break;
      case 'email':
        if (!value.trim()) {
          return 'Please enter your email.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address.';
        }
        break;
      default:
        return '';
    }
  };

  const validatePasswordField = (name, value) => {
    switch (name) {
      case 'currentPassword':
        if (!value) {
          return 'Please enter your current password.';
        }
        break;
      case 'newPassword':
        if (!value) {
          return 'Please enter a new password.';
        } else if (value.length < 6) {
          return 'Password must be at least 6 characters long.';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          return 'Please confirm your new password.';
        } else if (value !== passwordData.newPassword) {
          return 'Passwords do not match.';
        }
        break;
      default:
        return '';
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (profileErrors[name]) {
      setProfileErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // If changing newPassword, also validate confirmPassword
    if (name === 'newPassword' && passwordData.confirmPassword) {
      const confirmError = validatePasswordField('confirmPassword', passwordData.confirmPassword);
      setPasswordErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
  };

  const handleProfileBlur = (e) => {
    const { name, value } = e.target;
    const error = validateProfileField(name, value);
    if (error) {
      setProfileErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handlePasswordBlur = (e) => {
    const { name, value } = e.target;
    const error = validatePasswordField(name, value);
    if (error) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors = {};
    const requiredFields = ['name', 'email'];
    
    requiredFields.forEach(field => {
      const error = validateProfileField(field, profileData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    setProfileErrors(newErrors);
    
    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await updateProfile(profileData);
        if (response.data.success) {
          // Update user in localStorage
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const updatedUser = { ...currentUser, ...profileData };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          alert('Profile updated successfully!');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors = {};
    const requiredFields = ['currentPassword', 'newPassword', 'confirmPassword'];
    
    requiredFields.forEach(field => {
      const error = validatePasswordField(field, passwordData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    setPasswordErrors(newErrors);
    
    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      try {
        await changePassword(passwordData);
        alert('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (error) {
        console.error('Error changing password:', error);
        alert(error.response?.data?.message || 'Failed to change password. Please try again.');
      }
    }
  };

  const handleNotificationToggle = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Settings - Mobiloitte PMS</title>
      </Head>

      <Header />

      <div className={styles.layout}>
        <Sidebar />

        <main className={styles.mainContent}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.title}>Settings</h1>
              <p className={styles.subtitle}>Manage your account settings and preferences</p>
            </div>

            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'profile' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} />
                Profile
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'security' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <Lock size={18} />
                Security
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'notifications' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <Mail size={18} />
                Notifications
              </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className={styles.tabContent}>
                <h2 className={styles.sectionTitle}>Profile Information</h2>
                <form onSubmit={handleProfileUpdate} className={styles.form}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        <User size={16} />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        onBlur={handleProfileBlur}
                        className={styles.input}
                      />
                      {profileErrors.name && <div className={styles.fieldError}>{profileErrors.name}</div>}
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        <Mail size={16} />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        onBlur={handleProfileBlur}
                        className={styles.input}
                      />
                      {profileErrors.email && <div className={styles.fieldError}>{profileErrors.email}</div>}
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        <Globe size={16} />
                        Department
                      </label>
                      <input
                        type="text"
                        name="department"
                        value={profileData.department}
                        onChange={handleProfileChange}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        <Shield size={16} />
                        Role
                      </label>
                      <select
                        name="role"
                        value={profileData.role}
                        onChange={handleProfileChange}
                        className={styles.input}
                      >
                        <option value="developer">Developer</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className={styles.submitBtn}>
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className={styles.tabContent}>
                <h2 className={styles.sectionTitle}>Change Password</h2>
                <form onSubmit={handlePasswordChangeSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <Lock size={16} />
                      Current Password *
                    </label>
                    <div className={styles.passwordField}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        onBlur={handlePasswordBlur}
                        className={styles.input}
                      />
                      <button
                        type="button"
                        className={styles.togglePassword}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && <div className={styles.fieldError}>{passwordErrors.currentPassword}</div>}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <Lock size={16} />
                      New Password *
                    </label>
                    <div className={styles.passwordField}>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        onBlur={handlePasswordBlur}
                        className={styles.input}
                      />
                      <button
                        type="button"
                        className={styles.togglePassword}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordErrors.newPassword && <div className={styles.fieldError}>{passwordErrors.newPassword}</div>}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <Lock size={16} />
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      onBlur={handlePasswordBlur}
                      className={styles.input}
                    />
                    {passwordErrors.confirmPassword && <div className={styles.fieldError}>{passwordErrors.confirmPassword}</div>}
                  </div>
                  <button type="submit" className={styles.submitBtn}>
                    Update Password
                  </button>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className={styles.tabContent}>
                <h2 className={styles.sectionTitle}>Notification Preferences</h2>
                <div className={styles.notificationsList}>
                  <div className={styles.notificationItem}>
                    <div>
                      <h3>Email Notifications</h3>
                      <p>Receive email updates about your projects</p>
                    </div>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={() => handleNotificationToggle('emailNotifications')}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <div className={styles.notificationItem}>
                    <div>
                      <h3>Push Notifications</h3>
                      <p>Get browser push notifications</p>
                    </div>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={notificationSettings.pushNotifications}
                        onChange={() => handleNotificationToggle('pushNotifications')}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <div className={styles.notificationItem}>
                    <div>
                      <h3>Project Updates</h3>
                      <p>Notifications when projects are updated</p>
                    </div>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={notificationSettings.projectUpdates}
                        onChange={() => handleNotificationToggle('projectUpdates')}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <div className={styles.notificationItem}>
                    <div>
                      <h3>Task Assignments</h3>
                      <p>When you're assigned to a new task</p>
                    </div>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={notificationSettings.taskAssignments}
                        onChange={() => handleNotificationToggle('taskAssignments')}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </ProtectedRoute>
  );
}