
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { User, LogOut } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { ProfileModal } from "@/components/profile/ProfileModal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const NavigationBar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [authTab, setAuthTab] = useState<"sign-in" | "sign-up">("sign-in");

  // Clean up any modal state when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.pointerEvents = ''; // Ensure pointer events are enabled
      
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

  // Reset any potential pointer-events issues when navigating
  useEffect(() => {
    const resetPointerEvents = () => {
      document.body.style.pointerEvents = '';

      // Also reset any dialog/modal elements that might have pointer-events issues
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
    resetPointerEvents();

    // Clean up timeouts on unmount
    return resetPointerEvents;
  }, [showProfileModal, showAuthDialog]);

  const handleSignIn = () => {
    setAuthTab("sign-in");
    setShowAuthDialog(true);
  };

  const handleGetStarted = () => {
    setAuthTab("sign-up");
    setShowAuthDialog(true);
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

  const handleProfileClick = () => {
    setShowProfileModal(true);
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      {!user && (
        <div className="container flex items-center justify-between h-16 px-4 sm:px-6">
          <Link to="/" className="font-semibold text-xl">StudyBuddy</Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleSignIn}>
              Sign In
            </Button>
            <Button onClick={handleGetStarted}>
              Get Started
            </Button>
          </div>
        </div>
      )}
      
      {user && (
        <div className="container flex items-center justify-between h-16 px-4 sm:px-6">
          <Link to="/" className="font-semibold text-xl">StudyBuddy</Link>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
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
          </div>
        </div>
      )}
      
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} defaultTab={authTab} />
      <ProfileModal open={showProfileModal} onOpenChange={handleProfileModalChange} />
    </nav>
  );
};
