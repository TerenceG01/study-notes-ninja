
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";

export interface ProfileStats {
  notesCount: number;
  flashcardsCount: number;
  studyStreak: number;
}

export function useProfileData(isOpen: boolean) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [stats, setStats] = useState<ProfileStats>({
    notesCount: 0,
    flashcardsCount: 0,
    studyStreak: 0
  });

  // Fetch profile data when modal opens
  useEffect(() => {
    if (!user || !isOpen) return;
    
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
  }, [user, isOpen, toast, setTheme]);

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
      
      // Get flashcards count
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
      setStats({
        notesCount: notesCount || 0,
        flashcardsCount: flashcardsTotal,
        // For demo purposes, set a random streak between 1-14
        studyStreak: Math.floor(Math.random() * 14) + 1
      });
      
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

  return {
    user,
    username,
    setUsername,
    loading,
    statsLoading,
    stats,
    resolvedTheme,
    handleUpdateProfile,
    toggleTheme
  };
}
