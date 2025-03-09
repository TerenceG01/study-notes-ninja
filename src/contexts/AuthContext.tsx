
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
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

  // Function to apply the user's accent color safely
  const applyUserPreferences = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("accent_color, theme_preference")
        .eq("id", userId)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        // Apply accent color
        if (data.accent_color) {
          const colorMode = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
          
          // Map of color values
          const colorMap: Record<string, { light: string, dark: string }> = {
            purple: { 
              light: "271 81% 50%",
              dark: "240 84% 67%"
            },
            blue: { 
              light: "217 91% 60%",
              dark: "231 77% 61%"
            },
            green: { 
              light: "158 64% 52%",
              dark: "160 84% 39%"
            },
            orange: { 
              light: "21 90% 58%",
              dark: "20 90% 55%"
            },
            pink: { 
              light: "326 78% 60%",
              dark: "330 81% 55%"
            }
          };
          
          const colorValue = colorMap[data.accent_color]?.[colorMode] || colorMap.purple[colorMode];
          
          // Only set the primary color variable, no others to avoid breaking interactivity
          document.documentElement.style.setProperty('--primary', colorValue);
          console.log(`Applied user accent color: ${data.accent_color} in AuthContext`);
        }
      }
    } catch (err) {
      console.error("Error applying user preferences:", err);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      // Apply user preferences if user is logged in
      if (session?.user) {
        applyUserPreferences(session.user.id);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      
      // Apply user preferences when auth state changes
      if (session?.user) {
        applyUserPreferences(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
