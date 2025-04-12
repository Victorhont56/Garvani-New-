// src/pages/auth/confirm.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';

const EmailConfirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Process the authentication session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // User is authenticated after confirmation
        navigate('/dashboard');
      } else {
        // Redirect to login with confirmation success message
        navigate('/login-page', { 
          state: { 
            message: 'Email confirmed successfully! Please login.' 
          } 
        });
      }
    });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Processing your confirmation...</h2>
        <p>Please wait while we verify your email address.</p>
      </div>
    </div>
  );
};

export default EmailConfirmation;