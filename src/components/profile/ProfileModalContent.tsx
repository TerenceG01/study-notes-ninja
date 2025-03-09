
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { AppearanceCard } from "@/components/profile/AppearanceCard";
import { StatsCard } from "@/components/profile/StatsCard";
import { useProfileActions } from "@/hooks/useProfileActions";
import { useProfileStats } from "@/hooks/useProfileStats";
import { useAccentColor } from "@/hooks/useAccentColor";

interface ProfileModalContentProps {
  user: User | null;
  open: boolean;
}

export function ProfileModalContent({ user, open }: ProfileModalContentProps) {
  const [mounted, setMounted] = useState(false);
  const { accentColor, updateAccentColor } = useAccentColor();
  
  const {
    username,
    setUsername,
    loading,
    fetchProfile,
    updateProfile,
    toggleTheme,
    resolvedTheme
  } = useProfileActions(user?.id);
  
  const { 
    statsLoading, 
    notesCount, 
    flashcardsCount, 
    studyStreak 
  } = useProfileStats(user?.id, open);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user && open) {
      fetchProfile();
    }
  }, [user, open]);

  // Safe color change handler with debounce
  const handleAccentColorChange = (color: string) => {
    // Use requestAnimationFrame to ensure UI updates first
    requestAnimationFrame(() => {
      updateAccentColor(color);
    });
  };

  if (!mounted) {
    return null;
  }

  return (
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
            onSubmit={updateProfile} 
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
    </div>
  );
}
