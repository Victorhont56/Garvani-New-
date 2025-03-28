import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';

export default function EmailConfirm() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    // Check if this is an email confirmation redirect
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        setMessage('Email verified! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Email Confirmation</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}