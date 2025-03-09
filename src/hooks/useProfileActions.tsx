
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";

export function useProfileActions(userId: string | undefined) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const { toast } = useToast();
  const { setTheme, resolvedTheme } = useTheme();

  const fetchProfile = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, theme_preference")
        .eq("id", userId)
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

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username })
        .eq("id", userId);
        
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
    if (!userId) return;
    
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ theme_preference: newTheme })
        .eq("id", userId);
        
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
    username,
    setUsername,
    loading,
    fetchProfile,
    updateProfile,
    toggleTheme,
    resolvedTheme
  };
}
