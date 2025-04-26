"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/lib/supabase/supabase-provider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { supabase } = useSupabase();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace(
          "/auth/sign-in?redirect=" +
            encodeURIComponent(window.location.pathname)
        );
      }
    };

    checkAuth();
  }, [router, supabase.auth]);

  return <>{children}</>;
}
