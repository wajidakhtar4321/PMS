import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Already logged in, redirect to home
      router.push('/home');
    } else {
      // Not logged in, redirect to login page
      router.push('/login');
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Mobiloitte PMS - Project Management System</title>
        <meta name="description" content="Professional project management system by Mobiloitte" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    </>
  );
}
