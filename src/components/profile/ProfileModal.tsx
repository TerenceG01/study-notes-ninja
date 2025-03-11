
import { useState, useEffect } from "react";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { AppearanceCard } from "@/components/profile/AppearanceCard";
import { StatsCard } from "@/components/profile/StatsCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useProfileData } from "@/hooks/useProfileData";
import { ResponsiveContainer } from "@/components/ui/responsive-container";

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

  // Force cleanup of any pointer-events issues
  const forceCleanup = () => {
    document.body.style.pointerEvents = '';
    document.documentElement.style.pointerEvents = '';
    
    // Reset all elements with pointer-events style
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      if (element instanceof HTMLElement && element.style.pointerEvents === 'none') {
        element.style.pointerEvents = '';
      }
    });
    
    // Force browser repaint to ensure styles are applied
    document.body.getBoundingClientRect();
  };

  // Handle mounting state
  useEffect(() => {
    setMounted(true);
    forceCleanup();
    
    return () => {
      forceCleanup();
    };
  }, []);

  // Ensure proper cleanup when dialog close state changes
  useEffect(() => {
    if (!open) {
      forceCleanup();
      
      // Additional cleanup after a delay to ensure any async operations complete
      const timeoutId = setTimeout(forceCleanup, 150);
      return () => clearTimeout(timeoutId);
    }
  }, [open]);

  // Handle the dialog close event properly
  const handleOpenChange = (newOpenState: boolean) => {
    if (!newOpenState) {
      // Apply cleanup immediately
      forceCleanup();
      
      // Use requestAnimationFrame to ensure UI updates before state changes
      requestAnimationFrame(() => {
        onOpenChange(newOpenState);
        
        // Additional cleanup after state change
        setTimeout(forceCleanup, 50);
      });
    } else {
      onOpenChange(newOpenState);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <div className="py-2 sm:py-4">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">My Profile</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your personal information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6 w-full">
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
            
            <div className="space-y-4 sm:space-y-6 w-full">
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
