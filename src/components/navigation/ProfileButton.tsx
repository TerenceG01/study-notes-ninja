
import { useState, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { ProfileModal } from "@/components/profile/ProfileModal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const ProfileButton = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [authTab, setAuthTab] = useState<"sign-in" | "sign-up">("sign-in");

  // Global cleanup function to ensure UI stays interactive
  const resetAllPointerEvents = () => {
    // Reset the body and html element pointer-events
    document.body.style.pointerEvents = '';
    document.documentElement.style.pointerEvents = '';
    
    // Reset any dialog elements
    const dialogs = document.querySelectorAll('[role="dialog"]');
    dialogs.forEach(dialog => {
      if (dialog instanceof HTMLElement) {
        dialog.style.pointerEvents = '';
      }
    });
    
    // Reset any overlay elements
    const overlays = document.querySelectorAll('[data-radix-portal]');
    overlays.forEach(overlay => {
      if (overlay instanceof HTMLElement) {
        overlay.style.pointerEvents = '';
      }
    });
    
    // Also check for any elements with pointer-events: none
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      if (element instanceof HTMLElement && element.style.pointerEvents === 'none') {
        element.style.pointerEvents = '';
      }
    });
  };

  // Effect to clean up any pointer events issues when component mounts/unmounts
  useEffect(() => {
    // Clean up on mount
    resetAllPointerEvents();
    
    // Clean up on unmount
    return resetAllPointerEvents;
  }, []);

  // Effect to monitor and clean up pointer events when modal state changes
  useEffect(() => {
    if (!showProfileModal) {
      resetAllPointerEvents();
      
      // Additional cleanup with a delay to catch any async issues
      const timeoutId = setTimeout(resetAllPointerEvents, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [showProfileModal]);

  const handleSignIn = () => {
    setAuthTab("sign-in");
    setShowAuthDialog(true);
  };

  const handleProfileClick = () => {
    // Reset pointer-events before opening modal
    resetAllPointerEvents();
    setShowProfileModal(true);
  };
  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message
      });
    } else {
      toast({
        title: "Signed out successfully"
      });
    }
  };

  // Properly handle profile modal state changes
  const handleProfileModalChange = (open: boolean) => {
    setShowProfileModal(open);
    
    // If modal is closing, ensure UI stays interactive
    if (!open) {
      resetAllPointerEvents();
      
      // Force a repaint to ensure UI is interactive after a short delay
      setTimeout(() => {
        resetAllPointerEvents();
        
        // Additional force repaint if needed
        const bodyEl = document.body;
        if (bodyEl) {
          const display = bodyEl.style.display;
          bodyEl.style.display = 'none';
          void bodyEl.offsetHeight; // Force a repaint
          bodyEl.style.display = display || '';
        }
      }, 50);
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full"
              >
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSignIn}
          >
            Sign In
          </Button>
        )}
      </div>
      
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} defaultTab={authTab} />
      <ProfileModal open={showProfileModal} onOpenChange={handleProfileModalChange} />
    </>
  );
};
