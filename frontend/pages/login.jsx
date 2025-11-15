import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { loginUser } from '../utils/api';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import styles from '../styles/Auth.module.css';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value.trim()) {
          error = 'Please enter your email.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        } else if (value.length > 30) {
          error = 'Email must be less than 30 characters';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Please enter your password.';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters long';
        } else if (value.length > 40) {
          error = 'Password must be less than 40 characters';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Apply character limits
    let newValue = value;
    if (name === 'email' && value.length > 30) {
      newValue = value.slice(0, 30);
    } else if (name === 'password' && value.length > 40) {
      newValue = value.slice(0, 40);
    }
    
    setFormData({
      ...formData,
      [name]: newValue
    });

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }

    // Validate field if it has been touched
    if (touched[name]) {
      const fieldError = validateField(name, newValue);
      setErrors({
        ...errors,
        [name]: fieldError
      });
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
    // Prevent default form submission
    e.preventDefault();
    
    setLoading(true);

    // Mark all fields as touched to show validation errors
    setTouched({
      email: true,
      password: true
    });

    // Validate all fields
    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);
    
    setErrors({
      email: emailError,
      password: passwordError
    });
    
    // If there are validation errors, stop submission
    if (emailError || passwordError) {
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password
      });
      
      if (response && response.data && response.data.success) {
        const { token, ...userData } = response.data.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/home');
      } else {
        // Show error messages for both fields
        const errorMessage = (response && response.data && response.data.message) || 'Invalid credentials.';
        setErrors({
          email: errorMessage,
          password: errorMessage
        });
      }
    } catch (err) {
      // Show error messages for both fields
      const errorMessage = err.response?.data?.message || err.message || 'Invalid credentials.';
      setErrors({
        email: errorMessage,
        password: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Mobiloitte PMS</title>
        <meta name="description" content="Login to your account" />
      </Head>

      <Header />

      <main className={styles.authMain}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <img src="/logo.png" alt="Logo" className={styles.logo} />
              <h1 className={styles.authTitle}>Welcome Back</h1>
              <p className={styles.authSubtitle}>
                Sign in to access your project management system
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.authForm} noValidate>
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
                  className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
                  placeholder="Enter your email"
                  maxLength="30"
                />
                {errors.email && (
                  <div className={styles.fieldError}>{errors.email}</div>
                )}
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
                    className={`${styles.formInput} ${errors.password ? styles.inputError : ''}`}
                    placeholder="Enter your password"
                    maxLength="40"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {/* Reverse the icons - show eye when password is hidden, eye-off when visible */}
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <div className={styles.fieldError}>{errors.password}</div>
                )}
              </div>

              <div className={styles.formOptions}>
                <label className={styles.checkbox}>
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link href="/forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    Log In
                  </>
                )}
              </button>
            </form>

          </div>


        </div>
      </main>

      <Footer />
    </>
  );
}