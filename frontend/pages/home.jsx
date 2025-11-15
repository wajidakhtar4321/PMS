import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import Slider from '../components/Slider';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';
import { Briefcase, Users, TrendingUp, CheckCircle } from 'lucide-react';
import styles from '../styles/Home.module.css';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <ProtectedRoute>
      <Head>
        <title>Home - Mobiloitte PMS</title>
        <meta name="description" content="Welcome to Mobiloitte Project Management System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main className={styles.homePageMain}>
        {/* Slider Section */}
        <Slider />

        {/* Welcome Section */}
        <section className={styles.welcomeSection}>
          <div className={styles.container}>
            <h1 className={styles.welcomeTitle}>
              Welcome to Mobiloitte PMS{user?.name ? `, ${user.name}` : ''}!
            </h1>
            <p className={styles.welcomeText}>
              Your comprehensive project management solution for seamless collaboration and efficient workflow management.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Key Features</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon} style={{ background: '#EEF2FF' }}>
                  <CheckCircle size={40} color="#4F46E5" />
                </div>
                <h3>Task Management</h3>
                <p>Organize and track tasks with our intuitive Kanban board system</p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon} style={{ background: '#D1FAE5' }}>
                  <Users size={40} color="#10B981" />
                </div>
                <h3>Team Collaboration</h3>
                <p>Work together seamlessly with real-time updates and notifications</p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon} style={{ background: '#DBEAFE' }}>
                  <Briefcase size={40} color="#3B82F6" />
                </div>
                <h3>Project Tracking</h3>
                <p>Monitor progress and stay on top of deadlines effortlessly</p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon} style={{ background: '#FEF3C7' }}>
                  <TrendingUp size={40} color="#F59E0B" />
                </div>
                <h3>Analytics & Reports</h3>
                <p>Get insights with comprehensive analytics and detailed reports</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className={styles.actionsSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
            <div className={styles.actionsGrid}>
              <button 
                className={styles.actionCard}
                onClick={() => router.push('/dashboard')}
              >
                <div className={styles.actionIcon}>📊</div>
                <h3>Dashboard</h3>
                <p>View your projects overview</p>
              </button>

              <button 
                className={styles.actionCard}
                onClick={() => router.push('/projects')}
              >
                <div className={styles.actionIcon}>📁</div>
                <h3>Projects</h3>
                <p>Manage all your projects</p>
              </button>

              <button 
                className={styles.actionCard}
                onClick={() => router.push('/dashboard')}
              >
                <div className={styles.actionIcon}>✅</div>
                <h3>Tasks</h3>
                <p>View and manage tasks</p>
              </button>

              {user?.role === 'admin' && (
                <button 
                  className={styles.actionCard}
                  onClick={() => router.push('/users')}
                >
                  <div className={styles.actionIcon}>👥</div>
                  <h3>Users</h3>
                  <p>Manage system users</p>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.container}>
            <div className={styles.infoContent}>
              <h2>Why Choose Mobiloitte PMS?</h2>
              <ul className={styles.infoList}>
                <li>✅ Streamlined project workflows</li>
                <li>✅ Real-time collaboration tools</li>
                <li>✅ Comprehensive reporting system</li>
                <li>✅ User-friendly interface</li>
                <li>✅ Secure and reliable platform</li>
                <li>✅ Mobile responsive design</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </ProtectedRoute>
  );
}