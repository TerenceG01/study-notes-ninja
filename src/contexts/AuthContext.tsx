
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFirstTimeUser: boolean;
  setIsFirstTimeUser: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isFirstTimeUser: false,
  setIsFirstTimeUser: () => {}
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Check if it's the first time the user has logged in
      if (session?.user) {
        const checkFirstLogin = async () => {
          // Try to get the user's profile
          const { data, error } = await supabase
            .from('profiles')
            .select('has_seen_intro')
            .eq('id', session.user.id)
            .single();
          
          // If there's no profile or has_seen_intro is false, set isFirstTimeUser to true
          if (error || !data || data.has_seen_intro === false) {
            setIsFirstTimeUser(true);
          }
        };
        
        checkFirstLogin();
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        // Check if this is the first time the user has logged in
        const checkFirstLogin = async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('has_seen_intro')
            .eq('id', session.user.id)
            .single();
          
          // If there's no profile or has_seen_intro is false, set isFirstTimeUser to true
          if (error || !data || data.has_seen_intro === false) {
            setIsFirstTimeUser(true);
          }
        };
        
        checkFirstLogin();
      }
    });

    return () => {
      // Make sure to clean up the subscription to prevent memory leaks
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isFirstTimeUser, setIsFirstTimeUser }}>
      {children}
    </AuthContext.Provider>
  );
};
