import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { AppearanceCard } from "@/components/profile/AppearanceCard";
import { DangerZoneCard } from "@/components/profile/DangerZoneCard";
const Profile = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const {
    theme,
    setTheme,
    resolvedTheme
  } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle theme mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle profile data fetching
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    const fetchProfile = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from("profiles").select("username, theme_preference").eq("id", user.id).maybeSingle();
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
  }, [user, navigate, toast, setTheme]);
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const {
        error
      } = await supabase.from("profiles").update({
        username
      }).eq("id", user.id);
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
      const {
        error
      } = await supabase.from("profiles").update({
        theme_preference: newTheme
      }).eq("id", user.id);
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
  const handleSignOut = async () => {
    try {
      const {
        error
      } = await supabase.auth.signOut();
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

  // Prevent theme flash on load
  if (!mounted) {
    return null;
  }
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-[1400px] sm:px-6 lg:px-8 py-6 px-[10px]">
        <div className="mb-8 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
          <h1 className="text-4xl font-bold text-primary">My Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your personal information</p>
        </div>

        <div className="grid gap-6 max-w-3xl mx-auto">
          <ProfileInfoCard user={user} username={username} loading={loading} setUsername={setUsername} onSubmit={handleUpdateProfile} />
          <AppearanceCard resolvedTheme={resolvedTheme} onToggleTheme={toggleTheme} />
          <DangerZoneCard onSignOut={handleSignOut} />
        </div>
      </div>
    </div>;
};
export default Profile;