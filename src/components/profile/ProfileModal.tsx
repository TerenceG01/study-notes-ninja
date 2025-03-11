
import { useState, useEffect } from "react";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { AppearanceCard } from "@/components/profile/AppearanceCard";
import { StatsCard } from "@/components/profile/StatsCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useProfileData } from "@/hooks/useProfileData";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const [mounted, setMounted] = useState(false);
  
  const {
    user,
    username,
    setUsername,
    loading,
    statsLoading,
    stats,
    resolvedTheme,
    handleUpdateProfile,
    toggleTheme
  } = useProfileData(open);

  // Handle mounting state
  useEffect(() => {
    setMounted(true);
    return () => {
      // Ensure body pointer-events are reset when component unmounts
      document.body.style.pointerEvents = '';
    };
  }, []);

  // Fix pointer-events issue when dialog closes
  useEffect(() => {
    if (!open) {
      // Reset pointer-events on body and any modal elements
      document.body.style.pointerEvents = '';
      const dialogs = document.querySelectorAll('[role="dialog"]');
      dialogs.forEach(dialog => {
        if (dialog instanceof HTMLElement) {
          dialog.style.pointerEvents = '';
        }
      });
      
      // Also reset any overlay elements that might be causing issues
      const overlays = document.querySelectorAll('[data-radix-portal]');
      overlays.forEach(overlay => {
        if (overlay instanceof HTMLElement) {
          overlay.style.pointerEvents = '';
        }
      });
    }
  }, [open]);

  // Handle the dialog close event properly
  const handleOpenChange = (newOpenState: boolean) => {
    if (!newOpenState) {
      // Reset pointer-events before closing
      document.body.style.pointerEvents = '';
      
      // Small delay to ensure cleanup completes before state changes
      setTimeout(() => {
        onOpenChange(newOpenState);
      }, 0);
    } else {
      onOpenChange(newOpenState);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
                notesCount={stats.notesCount}
                flashcardsCount={stats.flashcardsCount}
                studyStreakDays={stats.studyStreak}
                isLoading={statsLoading}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
