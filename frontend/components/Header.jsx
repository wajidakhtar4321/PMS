import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, Home, Info, Briefcase, LayoutDashboard, LogIn, LogOut, User } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import styles from '../styles/Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  // Function to check if a link is active
  const isActiveLink = (path) => {
    // Special handling for home page - both '/' and '/home' should be considered home
    if (path === '/') {
      return router.pathname === '/' || router.pathname === '/index' || router.pathname === '/index.jsx' || router.pathname === '/home' || router.pathname === '/home.jsx';
    }
    
    // Special handling for dashboard - should be active when on any dashboard sub-route
    if (path === '/dashboard') {
      return router.pathname.startsWith('/dashboard') || router.pathname === '/users';
    }
    
    // For other pages, check if the current path starts with the link path
    return router.pathname.startsWith(path);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="Mobiloitte" className={styles.logoImage} />
            <span className={styles.logoText}>Mobiloitte PMS</span>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            <Link 
              href="/" 
              className={`${styles.navLink} ${isActiveLink('/') ? styles.activeNavLink : ''}`}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link 
              href="/about" 
              className={`${styles.navLink} ${isActiveLink('/about') ? styles.activeNavLink : ''}`}
            >
              <Info size={18} />
              <span>About</span>
            </Link>
            <Link 
              href="/projects" 
              className={`${styles.navLink} ${isActiveLink('/projects') ? styles.activeNavLink : ''}`}
            >
              <Briefcase size={18} />
              <span>Projects</span>
            </Link>
            {user && (
              <Link 
                href="/dashboard" 
                className={`${styles.navLink} ${isActiveLink('/dashboard') ? styles.activeNavLink : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            )}
          </nav>

          <div className={styles.authButtons}>
            {user ? (
              <>
                <span className={styles.userName}>
                  <User size={16} />
                  {user.name}
                </span>
                <button onClick={openLogoutModal} className={styles.logoutBtn}>
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className={`${styles.loginBtn} ${isActiveLink('/login') ? styles.activeNavLink : ''}`}
              >
                <LogIn size={18} />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className={styles.menuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className={styles.mobileNav}>
            <Link 
              href="/" 
              className={`${styles.mobileNavLink} ${isActiveLink('/') ? styles.activeMobileNavLink : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={18} />
              Home
            </Link>
            <Link 
              href="/about" 
              className={`${styles.mobileNavLink} ${isActiveLink('/about') ? styles.activeMobileNavLink : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Info size={18} />
              About
            </Link>
            <Link 
              href="/projects" 
              className={`${styles.mobileNavLink} ${isActiveLink('/projects') ? styles.activeMobileNavLink : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Briefcase size={18} />
              Projects
            </Link>
            {user && (
              <>
                <Link 
                  href="/dashboard" 
                  className={`${styles.mobileNavLink} ${isActiveLink('/dashboard') ? styles.activeMobileNavLink : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                {/* Mobile User Options */}
                <div className={styles.mobileUserSection}>
                  <div className={styles.mobileUserInfo}>
                    <User size={18} />
                    <span>{user.name}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      openLogoutModal();
                    }} 
                    className={styles.mobileLogoutBtn}
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </>
            )}
            {!user && (
              <Link 
                href="/login" 
                className={`${styles.mobileNavLink} ${isActiveLink('/login') ? styles.activeMobileNavLink : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn size={18} />
                Login
              </Link>
            )}
          </nav>
        )}
      </header>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={closeLogoutModal}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
      />
    </>
  );
}