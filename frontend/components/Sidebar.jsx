import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BarChart3, 
  Users, 
  Settings, 
  FileText,
  UserCog,
  Menu
} from 'lucide-react';
import styles from '../styles/Sidebar.module.css';

export default function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Close sidebar when resizing to desktop
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: CheckSquare, label: 'Tasks', path: '/dashboard/tasks' },
    { icon: BarChart3, label: 'Reports', path: '/dashboard/reports' },
    { icon: Users, label: 'Team', path: '/dashboard/team' },
    { icon: FileText, label: 'Documents', path: '/dashboard/documents' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  // Add Users management for admin only
  if (user?.role === 'admin') {
    menuItems.splice(4, 0, { icon: UserCog, label: 'Users', path: '/users' });
  }

  // Mobile toggle button component
  const MobileToggle = () => (
    <button 
      className={styles.mobileToggle}
      onClick={() => setIsMobileOpen(!isMobileOpen)}
    >
      <Menu size={24} />
    </button>
  );

  return (
    <>
      {/* Mobile toggle button - visible only on mobile */}
      <div className={styles.mobileToggleContainer}>
        <MobileToggle />
      </div>
      
      {/* Sidebar - hidden on mobile by default, shown when toggled */}
      <aside className={`${styles.sidebar} ${isMobileOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.nav}>
          {/* Mobile header without close button */}
          <div className={styles.mobileHeader}>
            <h3 className={styles.sidebarTitle}>Navigation</h3>
          </div>
          
          <ul className={styles.menu}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link 
                    href={item.path}
                    className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                    onClick={() => setIsMobileOpen(false)} // Close on mobile after selection
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isMobileOpen && <div className={styles.overlay} onClick={() => setIsMobileOpen(false)} />}
    </>
  );
}