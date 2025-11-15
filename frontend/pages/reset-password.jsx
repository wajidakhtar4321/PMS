import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { resetPassword } from '../utils/api';
import { Lock, CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import styles from '../styles/Auth.module.css';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: ''
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Token will be available after router is ready
  }, [router.isReady]);

  const validateField = (name, value) => {
    switch (name) {
      case 'password':
        if (!value) {
          return 'Please enter your password.';
        } else if (value.length < 6) {
          return 'Password must be at least 6 characters long.';
        } else if (value.length > 50) {
          return 'Password must be less than 50 characters.';
        } else if (!/(?=.*[a-z])/.test(value)) {
          return 'Password must contain at least one lowercase letter.';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          return 'Password must contain at least one uppercase letter.';
        } else if (!/(?=.*\d)/.test(value)) {
          return 'Password must contain at least one number.';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          return 'Please confirm your password.';
        } else if (value !== formData.password) {
          return 'Passwords do not match.';
        }
        break;
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }

    // If changing password, also revalidate confirmPassword
    if (name === 'password' && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    const fieldError = validateField(name, value);
    setErrors({
      ...errors,
      [name]: fieldError
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setErrors({ general: 'Invalid or missing reset token.' });
      return;
    }
    
    // Validate all fields
    const passwordError = validateField('password', formData.password);
    const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword);
    
    setErrors({
      password: passwordError,
      confirmPassword: confirmPasswordError
    });
    
    // If there are validation errors, stop submission
    if (passwordError || confirmPasswordError) {
      return;
    }
    
    setLoading(true);
    setErrors({ general: '' });
    
    try {
      const response = await resetPassword(token, { password: formData.password });
      
      if (response && response.data && response.data.success) {
        setSuccess(true);
      } else {
        const errorMessage = (response && response.data && response.data.message) || 'Failed to reset password.';
        setErrors({ general: errorMessage });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to reset password.';
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password - Mobiloitte PMS</title>
        <meta name="description" content="Reset your password" />
      </Head>

      <Header />

      <main className={styles.authMain}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <div className={styles.iconWrapper}>
                <Lock size={40} />
              </div>
              <h1 className={styles.authTitle}>Reset Password</h1>
              <p className={styles.authSubtitle}>
                Enter your new password below to reset your account password.
              </p>
            </div>

            {success ? (
              <div className={styles.successMessage}>
                <CheckCircle size={48} className={styles.successIcon} />
                <h3>Password Reset Successfully!</h3>
                <p>Your password has been changed successfully.</p>
                <Link href="/login" className={styles.submitButton}>
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.authForm} noValidate>
                {errors.general && (
                  <div className={styles.fieldError} style={{ marginBottom: '1rem' }}>
                    {errors.general}
                  </div>
                )}
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <Lock size={18} />
                    New Password
                  </label>
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${styles.formInput} ${errors.password ? styles.inputError : ''}`}
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <div className={styles.fieldError}>{errors.password}</div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <Lock size={18} />
                    Confirm New Password
                  </label>
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${styles.formInput} ${errors.confirmPassword ? styles.inputError : ''}`}
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className={styles.fieldError}>{errors.confirmPassword}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className={styles.spinner}></div>
                      Resetting...
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      Reset Password
                    </>
                  )}
                </button>

                <div className={styles.formFooter}>
                  <Link href="/login" className={styles.backToLogin}>
                    <ArrowLeft size={16} />
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}