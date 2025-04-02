import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';

export default function AuthConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email'); // Get email from URL or storage

  useEffect(() => {
    const confirmAuth = async () => {
      if (!token) {
        toast.error('Invalid confirmation token');
        navigate('/');
        return;
      }

      try {
        // Try to get email from localStorage if not in URL
        const userEmail = email || localStorage.getItem('signup_email');
        
        if (!userEmail) {
          throw new Error('Email not found');
        }

        const { error } = await supabase.auth.verifyOtp({
          type: 'email',
          email: userEmail,
          token,
        });

        if (error) throw error;

        toast.success('Email confirmed successfully!');
        localStorage.removeItem('signup_email'); // Clean up
        navigate('/dashboard');
      } catch (error) {
        toast.error(`Confirmation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        navigate('/login');
      }
    };

    confirmAuth();
  }, [token, email, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Confirming your email...</p>
      </div>
    </div>
  );
}