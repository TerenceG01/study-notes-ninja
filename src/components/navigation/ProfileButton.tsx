
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

  // Effect to clean up any pointer events issues when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.pointerEvents = '';
      
      // Clean up any dialogs that might be open
      const dialogs = document.querySelectorAll('[role="dialog"]');
      dialogs.forEach(dialog => {
        if (dialog instanceof HTMLElement) {
          dialog.style.pointerEvents = '';
        }
      });
      
      // Clean up overlay elements
      const overlays = document.querySelectorAll('[data-radix-portal]');
      overlays.forEach(overlay => {
        if (overlay instanceof HTMLElement) {
          overlay.style.pointerEvents = '';
        }
      });
    };
  }, []);

  const handleSignIn = () => {
    setAuthTab("sign-in");
    setShowAuthDialog(true);
  };

  const handleProfileClick = () => {
    // Make sure to properly update state
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
    if (!open) {
      // Reset pointer-events when modal closes
      document.body.style.pointerEvents = '';
      
      // Force a small repaint to ensure UI is interactive
      setTimeout(() => {
        const bodyEl = document.body;
        if (bodyEl) {
          bodyEl.style.display = 'none';
          void bodyEl.offsetHeight; // Force a repaint
          bodyEl.style.display = '';
        }
      }, 0);
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
