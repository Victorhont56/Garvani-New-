// components/AdminRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/AuthProvider";
import { checkAdminStatus } from "@/lib/supabase/admin";
import { useEffect, useState } from "react";

export function AdminRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (user) {
        const adminStatus = await checkAdminStatus(user.id);
        setIsAdmin(adminStatus);
      }
      setLoading(false);
    };
    
    verifyAdmin();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user || !isAdmin) return <Navigate to="/" replace />;
  
  return children;
}
