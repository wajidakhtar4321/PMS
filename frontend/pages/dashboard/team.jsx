import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { getAllUsers } from '../../utils/api';
import { Mail, User, Shield } from 'lucide-react';
import styles from '../../styles/Team.module.css';

export default function Team() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return '#ef4444';
      case 'manager': return '#f59e0b';
      case 'developer': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Team - Mobiloitte PMS</title>
      </Head>

      <Header />

      <div className={styles.layout}>
        <Sidebar />

        <main className={styles.mainContent}>
          <div className={styles.container}>
            <div className={styles.header}>
              <div>
                <h1 className={styles.title}>Team Members</h1>
                <p className={styles.subtitle}>Manage your team and collaborate</p>
              </div>
            </div>

            {loading ? (
              <div className={styles.loading}>Loading team members...</div>
            ) : (
              <div className={styles.teamGrid}>
                {users.map((user) => (
                  <div key={user._id} className={styles.memberCard}>
                    <div className={styles.avatar}>
                      <User size={40} />
                    </div>
                    <div className={styles.memberInfo}>
                      <h3>{user.name}</h3>
                      <div className={styles.memberMeta}>
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                      <div className={styles.memberMeta}>
                        <Shield size={14} />
                        <span
                          className={styles.roleBadge}
                          style={{ background: getRoleBadgeColor(user.role) }}
                        >
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </ProtectedRoute>
  );
}
