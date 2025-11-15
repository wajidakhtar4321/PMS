import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import ProtectedRoute from '../components/ProtectedRoute';
import { registerUser } from '../utils/api';
import { User, Mail, Lock, UserPlus, Eye, EyeOff, Briefcase, ArrowLeft } from 'lucide-react';
import styles from '../styles/Auth.module.css';

export default function Register() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'developer',
    department: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    password: '',
    confirmPassword: ''
  });
  const [touched, setTouched] = useState({ 
    name: false,
    email: false,
    role: false,
    department: false,
    password: false,
    confirmPassword: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in and is admin
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    setCurrentUser(user);

    if (user.role !== 'admin') {
      alert('Access denied. Only administrators can create users.');
      router.push('/dashboard');
      return;
    }
  }, [router]);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Please enter your full name.';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters long.';
        } else if (value.trim().length > 50) {
          error = 'Name must be less than 50 characters.';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Name can only contain letters and spaces.';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Please enter your full email address.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address.';
        } else if (value.trim().length > 70) {
          error = 'Email must be less than 70 characters.';
        }
        break;

      case 'role':
        if (!value) {
          error = 'Please select a role.';
        }
        break;

      case 'department':
        if (!value) {
          error = 'Please enter your department.';
        } else if (value.trim().length < 2) {
          error = 'Department must be at least 2 characters long.';
        } else if (value.trim().length > 50) {
          error = 'Department must be less than 50 characters.';
        }
        break;

  

      case 'password':
        if (!value) {
          error = 'Please enter your password.';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters long.';
        } else if (value.length > 50) {
          error = 'Password must be less than 50 characters.';
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = 'Password must contain at least one lowercase .';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = 'Password must contain at least one uppercase letter.';
        } else if (!/(?=.*\d)/.test(value)) {
          error = 'Password must contain at least one number.';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please enter your confirm password.';
        } else if (value !== formData.password) {
          error = 'Passwords do not match.';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate field if it has been touched
    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors({
        ...errors,
        [name]: fieldError
      });
    }

    // If changing password, also revalidate confirmPassword
    if (name === 'password' && touched.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched({
      ...touched,
      [name]: true
    });

    const fieldError = validateField(name, value);
    setErrors({
      ...errors,
      [name]: fieldError
    });
  };

  const handleSubmit = async (e) => {
    // ABSOLUTELY PREVENT ALL BROWSER VALIDATION
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    if (e && e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
      e.nativeEvent.stopImmediatePropagation();
    }
    
    // Do not validate anything - just submit whatever data we have
    setLoading(true);
    
    try {
      const { confirmPassword, ...registerData } = formData;
      // Submit regardless of validation
      const response = await registerUser(registerData);
      
      if (response.data.success) {
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'developer',
          department: ''
        });
        setTouched({
          name: false,
          email: false,
          role: false,
          department: false,
          password: false,
          confirmPassword: false
        });
        setErrors({
          name: '',
          email: '',
          role: '',
          department: '',
          password: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
      // Even if there's an error, don't show validation messages
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className={styles.authMain}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Create User - Mobiloitte PMS</title>
        <meta name="description" content="Create a new user account" />
      </Head>

      <Header />

      <div className={styles.dashboardLayout}>
        <Sidebar />

        <main className={styles.mainContent}>
          <div className={styles.container}>
            <div className={styles.pageHeader}>
              <button className={styles.backButton} onClick={() => router.push('/dashboard')}>
                <ArrowLeft size={20} />
                Back to Dashboard
              </button>
            </div>

            <div className={styles.authCard}>
              <div className={styles.authHeader}>
                <div className={styles.iconWrapper}>
                  <UserPlus size={40} />
                </div>
                <h1 className={styles.authTitle}>Create New User</h1>
                <p className={styles.authSubtitle}>
                  Add a new user to Mobiloitte PMS
                </p>
              </div>

              <form 
                onSubmit={handleSubmit}
                className={styles.authForm} 
                noValidate
                autoComplete="off"
                method="post"
                action="javascript:void(0);"
              >
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <User size={18} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${styles.formInput} ${errors.name && touched.name ? styles.inputError : ''}`}
                  placeholder="Enter your full name"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <Mail size={18} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${styles.formInput} ${errors.email && touched.email ? styles.inputError : ''}`}
                  placeholder="Enter your email"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <Briefcase size={18} />
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.formInput} ${errors.role && touched.role ? styles.inputError : ''}`}
                  >
                    <option value="">Select a role</option>
                    <option value="developer">Developer</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <Briefcase size={18} />
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.formInput} ${errors.department && touched.department ? styles.inputError : ''}`}
                    placeholder="e.g. Engineering"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <Lock size={18} />
                  Password
                </label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.formInput} ${errors.password && touched.password ? styles.inputError : ''}`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <Lock size={18} />
                  Confirm Password
                </label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.formInput} ${errors.confirmPassword && touched.confirmPassword ? styles.inputError : ''}`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className={styles.spinner}></div>
                      Creating user...
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      Create User
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </ProtectedRoute>
  );
}
