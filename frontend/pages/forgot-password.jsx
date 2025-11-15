import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { forgotPassword } from '../utils/api';
import { Mail, Send, ArrowLeft } from 'lucide-react';
import styles from '../styles/Auth.module.css';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    if (!email) {
      return 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address.';
    } else if (email.length > 70) {
      return 'Email must be less than 70 characters.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await forgotPassword({ email });
      
      if (response && response.data && response.data.success) {
        setSuccess(true);
      } else {
        const errorMessage = (response && response.data && response.data.message) || 'Failed to send reset email.';
        setError(errorMessage);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send reset email.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password - Mobiloitte PMS</title>
        <meta name="description" content="Reset your password" />
      </Head>

      <Header />

      <main className={styles.authMain}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <div className={styles.iconWrapper}>
                <Mail size={40} />
              </div>
              <h1 className={styles.authTitle}>Forgot Password?</h1>
              <p className={styles.authSubtitle}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {success ? (
              <div className={styles.successMessage}>
                <p>
                  Password reset instructions have been sent to your email address. 
                  Please check your inbox and follow the instructions to reset your password.
                </p>
                <Link href="/login" className={styles.backToLogin}>
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.authForm} noValidate>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <Mail size={18} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    className={`${styles.formInput} ${error ? styles.inputError : ''}`}
                    placeholder="Enter your email"
                  />
                  {error && (
                    <div className={styles.fieldError}>{error}</div>
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
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Reset Link
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