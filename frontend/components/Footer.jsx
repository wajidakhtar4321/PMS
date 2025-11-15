import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import styles from '../styles/Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Company Info */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Mobiloitte</h3>
            <p className={styles.description}>
              Leading the way in innovative project management solutions. 
              Empowering teams to deliver excellence.
            </p>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Quick Links</h3>
            <ul className={styles.linkList}>
              <li><a href="/" className={styles.link}>Home</a></li>
              <li><a href="/about" className={styles.link}>About Us</a></li>
              <li><a href="/projects" className={styles.link}>Projects</a></li>
              <li><a href="/dashboard" className={styles.link}>Dashboard</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Contact Us</h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <Mail size={18} />
                <span>contact@mobiloitte.com</span>
              </li>
              <li className={styles.contactItem}>
                <Phone size={18} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className={styles.contactItem}>
                <MapPin size={18} />
                <span>123 Business Ave, Tech City, TC 12345</span>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Our Services</h3>
            <ul className={styles.linkList}>
              <li><a href="#" className={styles.link}>Project Planning</a></li>
              <li><a href="#" className={styles.link}>Team Management</a></li>
              <li><a href="#" className={styles.link}>Resource Allocation</a></li>
              <li><a href="#" className={styles.link}>Analytics & Reporting</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} Mobiloitte. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <a href="#" className={styles.bottomLink}>Privacy Policy</a>
            <a href="#" className={styles.bottomLink}>Terms of Service</a>
            <a href="#" className={styles.bottomLink}>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
