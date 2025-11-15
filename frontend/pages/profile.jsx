import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';
import ConfirmationModal from '../components/ConfirmationModal';
import { getUserProfile } from '../utils/api';
import { User, Mail, Briefcase, Building, Calendar, Settings, LogOut, Edit } from 'lucide-react';
import styles from '../styles/Profile.module.css';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Header />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading profile...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Profile - Mobiloitte PMS</title>
        <meta name="description" content="User Profile" />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.profileLayout}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
              <div className={styles.profileCard}>
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatar}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <button className={styles.editAvatarBtn}>
                    <Edit size={16} />
                  </button>
                </div>
                <h2 className={styles.userName}>{user?.name}</h2>
                <p className={styles.userRole}>{user?.role}</p>
              </div>

              <nav className={styles.nav}>
                <button
                  className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User size={20} />
                  Profile Information
                </button>
                <button
                  className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings size={20} />
                  Settings
                </button>
                <button className={styles.navItem} onClick={openLogoutModal}>
                  <LogOut size={20} />
                  Logout
                </button>
              </nav>
            </div>

            {/* Main Content */}
            <div className={styles.content}>
              {activeTab === 'profile' && (
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h3>Profile Information</h3>
                    <button className={styles.editButton}>
                      <Edit size={18} />
                      Edit Profile
                    </button>
                  </div>

                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>
                        <User size={18} />
                        <span>Full Name</span>
                      </div>
                      <div className={styles.infoValue}>{user?.name}</div>
                    </div>

                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>
                        <Mail size={18} />
                        <span>Email Address</span>
                      </div>
                      <div className={styles.infoValue}>{user?.email}</div>
                    </div>

                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>
                        <Briefcase size={18} />
                        <span>Role</span>
                      </div>
                      <div className={styles.infoValue}>
                        <span className={`${styles.badge} ${styles[user?.role]}`}>
                          {user?.role}
                        </span>
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>
                        <Building size={18} />
                        <span>Department</span>
                      </div>
                      <div className={styles.infoValue}>
                        {user?.department || 'Not specified'}
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>
                        <Calendar size={18} />
                        <span>Member Since</span>
                      </div>
                      <div className={styles.infoValue}>
                        {new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h3>Account Settings</h3>
                  </div>

                  <div className={styles.settingsList}>
                    <div className={styles.settingItem}>
                      <div>
                        <h4>Change Password</h4>
                        <p>Update your password regularly to keep your account secure.</p>
                      </div>
                      <button className={styles.settingButton}>Change</button>
                    </div>

                    <div className={styles.settingItem}>
                      <div>
                        <h4>Email Notifications</h4>
                        <p>Manage your email notification preferences</p>
                      </div>
                      <label className={styles.switch}>
                        <input type="checkbox" defaultChecked />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.settingItem}>
                      <div>
                        <h4>Two-Factor Authentication</h4>
                        <p>Add an extra layer of security to your account</p>
                      </div>
                      <button className={styles.settingButton}>Enable</button>
                    </div>

                    <div className={styles.settingItem}>
                      <div>
                        <h4>Delete Account</h4>
                        <p className={styles.dangerText}>
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <button className={styles.dangerButton}>Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={closeLogoutModal}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
      />
    </ProtectedRoute>
  );
}