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
import { LanguageSelector } from "@/components/language/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const NavigationBar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [authTab, setAuthTab] = useState<"sign-in" | "sign-up">("sign-in");
  const { t } = useLanguage();

  // Function to reset pointer-events to ensure UI stays interactive
  const resetPointerEvents = () => {
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

  // Clean up any modal state when component mounts/unmounts
  useEffect(() => {
    // Initial cleanup
    resetPointerEvents();
    
    // Cleanup on unmount
    return resetPointerEvents;
  }, []);

  // Reset pointer-events when navigating or when modal state changes
  useEffect(() => {
    if (!showProfileModal && !showAuthDialog) {
      resetPointerEvents();
      
      // Additional cleanup with a delay to catch any async issues
      const timeoutId = setTimeout(resetPointerEvents, 100);
      return () => clearTimeout(timeoutId);
    }
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
    // Reset pointer-events before opening modal
    resetPointerEvents();
    setShowProfileModal(true);
  };
  
  // Properly handle profile modal state changes
  const handleProfileModalChange = (open: boolean) => {
    setShowProfileModal(open);
    
    // If modal is closing, ensure UI stays interactive
    if (!open) {
      resetPointerEvents();
      
      // Force a repaint to ensure UI is interactive
      setTimeout(() => {
        resetPointerEvents();
        
        // Additional force repaint
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      {!user && (
        <div className="container flex items-center justify-between h-16 px-4 sm:px-6">
          <Link to="/" className="font-semibold text-xl">StudyBuddy</Link>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Button variant="ghost" onClick={handleSignIn}>
              {t("signIn")}
            </Button>
            <Button onClick={handleGetStarted}>
              {t("getStartedFree")}
            </Button>
          </div>
        </div>
      )}
      
      {user && (
        <div className="container flex items-center justify-between h-16 px-4 sm:px-6">
          <Link to="/" className="font-semibold text-xl">StudyBuddy</Link>
          <div className="flex items-center space-x-4">
            <LanguageSelector variant="minimal" />
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
