"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { type Session, type AuthChangeEvent } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { config } from "@/lib/config";

type User = {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  provider?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (provider: "github" | "google") => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [supabase] = useState(() =>
    createBrowserClient(config.supabase.url, config.supabase.anonKey)
  );

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth
      .getSession()
      .then(({ data: { session } }: { data: { session: Session | null } }) => {
        if (session) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.full_name,
            avatar_url: session.user.user_metadata.avatar_url,
            provider: session.user.app_metadata.provider,
          });
        }
        setIsLoading(false);
      });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (session) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.full_name,
            avatar_url: session.user.user_metadata.avatar_url,
            provider: session.user.app_metadata.provider,
          });
          // Redirect to home page on successful sign in
          if (
            event === "SIGNED_IN" &&
            ["/auth/sign-in", "/auth/sign-up"].includes(
              window.location.pathname
            )
          ) {
            router.push("/");
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, router]);

  const signIn = async (provider: "github" | "google") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.session) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      if (error) throw error;

      // Since email confirmation is disabled, user should be authenticated immediately
      if (data.session) {
        setUser({
          id: data.user!.id,
          email: data.user!.email!,
          name: name,
          avatar_url: data.user?.user_metadata.avatar_url,
          provider: "email",
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
