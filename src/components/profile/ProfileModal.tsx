import { useState, useEffect } from "react";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { AppearanceCard } from "@/components/profile/AppearanceCard";
import { StatsCard } from "@/components/profile/StatsCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useProfileData } from "@/hooks/useProfileData";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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

  const forceCleanup = () => {
    document.body.style.pointerEvents = '';
    document.documentElement.style.pointerEvents = '';
    
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      if (element instanceof HTMLElement && element.style.pointerEvents === 'none') {
        element.style.pointerEvents = '';
      }
    });
    
    document.body.getBoundingClientRect();
  };

  useEffect(() => {
    setMounted(true);
    forceCleanup();
    
    return () => {
      forceCleanup();
    };
  }, []);

  useEffect(() => {
    if (!open) {
      forceCleanup();
      
      const timeoutId = setTimeout(forceCleanup, 150);
      return () => clearTimeout(timeoutId);
    }
  }, [open]);

  const handleOpenChange = (newOpenState: boolean) => {
    if (!newOpenState) {
      forceCleanup();
      
      requestAnimationFrame(() => {
        onOpenChange(newOpenState);
        
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
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleOpenChange(false)} 
          className="absolute right-4 top-4 rounded-full p-2 z-10"
          aria-label="Close profile modal"
        >
          <X className="h-4 w-4" />
        </Button>
        
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
