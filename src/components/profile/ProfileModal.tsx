
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { AppearanceCard } from "@/components/profile/AppearanceCard";
import { StatsCard } from "@/components/profile/StatsCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notesCount, setNotesCount] = useState(0);
  const [flashcardsCount, setFlashcardsCount] = useState(0);
  const [studyStreak, setStudyStreak] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user || !open) return;
    
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, theme_preference, created_at")
          .eq("id", user.id)
          .maybeSingle();
        if (error) throw error;
        if (data) {
          setUsername(data.username || "");
          if (data.theme_preference) {
            setTheme(data.theme_preference);
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
  }, [user, open, toast, setTheme]);

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

  if (!mounted) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] md:max-w-[80vw] lg:max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="py-4">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">My Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your personal information</p>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
