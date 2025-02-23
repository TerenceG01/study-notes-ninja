
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, theme_preference")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching profile",
          description: error.message,
        });
        return;
      }

      if (data) {
        setUsername(data.username || "");
        if (data.theme_preference) {
          setTheme(data.theme_preference);
        }
      }
    };

    fetchProfile();
  }, [user, navigate, toast, setTheme]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", user.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
    } else {
      toast({
        title: "Profile updated successfully",
      });
    }
    setLoading(false);
  };

  const toggleTheme = async () => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({ theme_preference: newTheme })
        .eq("id", user.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error updating theme preference",
          description: error.message,
        });
        return;
      }
    }
    setTheme(newTheme);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } else {
      navigate("/auth");
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl px-4 mx-auto py-8">
        <div className="mb-8 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
          <h1 className="text-4xl font-bold text-primary">My Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your personal information</p>
        </div>

        <div className="grid gap-6">
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
          <DangerZoneCard onSignOut={handleSignOut} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
