import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function SupabaseListener({
  serverSession,
}: {
  serverSession: any;
}) {


  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverSession?.access_token) {
        window.location.reload()
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [serverSession, window.location]);

  return null;
}