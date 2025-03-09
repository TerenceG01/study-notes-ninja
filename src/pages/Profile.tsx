import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { AppearanceCard } from "@/components/profile/AppearanceCard";
import { StatsCard } from "@/components/profile/StatsCard";
import { ResponsiveContainer } from "@/components/ui/responsive-container";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notesCount, setNotesCount] = useState(0);
  const [flashcardsCount, setFlashcardsCount] = useState(0);
  const [studyStreak, setStudyStreak] = useState(0);
  const [accentColor, setAccentColor] = useState("purple");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, theme_preference, accent_color, created_at")
          .eq("id", user.id)
          .maybeSingle();
        if (error) throw error;
        if (data) {
          setUsername(data.username || "");
          if (data.theme_preference) {
            setTheme(data.theme_preference);
          }
          if (data.accent_color) {
            setAccentColor(data.accent_color);
            // Apply accent color to document root
            applyAccentColor(data.accent_color);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error fetching profile",
          description: error instanceof Error ? error.message : "An error occurred"
        });
      }
    };
    
    fetchProfile();
    fetchUserStats();
  }, [user, navigate, toast, setTheme]);

  const fetchUserStats = async () => {
    if (!user) return;
    
    setStatsLoading(true);
    try {
      // Get notes count
      const { count: notesCount, error: notesError } = await supabase
        .from("notes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      
      if (notesError) throw notesError;
      
      // Get flashcards count - Fix for the TypeScript error
      const userDecks = await supabase
        .from("flashcard_decks")
        .select("id")
        .eq("user_id", user.id);
        
      if (userDecks.error) throw userDecks.error;
      
      // If user has decks, get the count of flashcards in those decks
      let flashcardsTotal = 0;
      if (userDecks.data && userDecks.data.length > 0) {
        const deckIds = userDecks.data.map(deck => deck.id);
        
        const { count, error: flashcardsError } = await supabase
          .from("flashcards")
          .select("*", { count: "exact", head: true })
          .in("deck_id", deckIds);
          
        if (flashcardsError) throw flashcardsError;
        flashcardsTotal = count || 0;
      }
      
      // Set the values
      setNotesCount(notesCount || 0);
      setFlashcardsCount(flashcardsTotal);
      
      // For demo purposes, set a random streak between 1-14
      setStudyStreak(Math.floor(Math.random() * 14) + 1);
      
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username })
        .eq("id", user.id);
      if (error) throw error;
      toast({
        title: "Profile updated successfully"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error instanceof Error ? error.message : "An error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    if (!user) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ theme_preference: newTheme })
        .eq("id", user.id);
      if (error) throw error;
      setTheme(newTheme);
    } catch (error) {
      console.error("Error updating theme preference:", error);
      toast({
        variant: "destructive",
        title: "Error updating theme preference",
        description: error instanceof Error ? error.message : "An error occurred"
      });
    }
  };

  const handleAccentColorChange = async (color: string) => {
    setAccentColor(color);
    applyAccentColor(color);
    
    if (!user) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ accent_color: color })
        .eq("id", user.id);
      if (error) throw error;
      toast({
        title: "Accent color updated",
        description: `Theme accent color changed to ${color}`,
      });
    } catch (error) {
      console.error("Error updating accent color:", error);
      toast({
        variant: "destructive",
        title: "Error updating accent color",
        description: error instanceof Error ? error.message : "An error occurred"
      });
    }
  };

  // Function to apply accent color to CSS variables
  const applyAccentColor = (color: string) => {
    // Tailwind doesn't support dynamic classes at runtime
    // So we manually update CSS variables that could be used in the theme
    const root = document.documentElement;
    
    // Map color values to Tailwind color values
    const colorMap: Record<string, { light: string, dark: string }> = {
      purple: { 
        light: "271 81% 50%", // #6D28D9
        dark: "240 84% 67%"   // #6366F1
      },
      blue: { 
        light: "217 91% 60%", // #3B82F6
        dark: "231 77% 61%"   // #598EF3
      },
      green: { 
        light: "158 64% 52%", // #10B981
        dark: "160 84% 39%"   // #059669
      },
      orange: { 
        light: "21 90% 58%",  // #F97316
        dark: "20 90% 55%"    // #EA580C
      },
      pink: { 
        light: "326 78% 60%", // #EC4899
        dark: "330 81% 60%"   // #DB2777
      }
    };

    const themeMode = resolvedTheme === 'dark' ? 'dark' : 'light';
    const colorValue = colorMap[color]?.[themeMode] || colorMap.purple[themeMode];
    
    // Update primary color variables
    root.style.setProperty('--primary', colorValue);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error instanceof Error ? error.message : "An error occurred"
      });
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <ResponsiveContainer className="pb-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">My Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your personal information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6 w-full">
            <ProfileInfoCard 
              user={user} 
              username={username} 
              loading={loading} 
              setUsername={setUsername} 
              onSubmit={handleUpdateProfile} 
            />
            <AppearanceCard 
              resolvedTheme={resolvedTheme} 
              onToggleTheme={toggleTheme}
              accentColor={accentColor}
              onAccentColorChange={handleAccentColorChange}
            />
          </div>
          
          <div className="space-y-6 w-full">
            <StatsCard 
              joinDate={user?.created_at || new Date().toISOString()}
              notesCount={notesCount}
              flashcardsCount={flashcardsCount}
              studyStreakDays={studyStreak}
              isLoading={statsLoading}
            />
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export default Profile;
