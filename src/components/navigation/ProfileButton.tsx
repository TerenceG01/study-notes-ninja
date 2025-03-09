
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { User } from "lucide-react";
import { ProfileModal } from "@/components/profile/ProfileModal";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ProfileButtonProps {
  className?: string;
}

export const ProfileButton = ({ className }: ProfileButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [authTab, setAuthTab] = useState<"sign-in" | "sign-up">("sign-in");

  // Clean up any modal state when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.pointerEvents = ''; // Ensure pointer events are enabled
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
        description: error.message,
      });
    } else {
      toast({
        title: "Signed out successfully",
      });
    }
  };

  const handleProfileClick = () => {
    setShowProfileModal(prev => !prev);
  };

  return (
    <div className={cn("flex gap-3", className)}>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-full bg-background/50 backdrop-blur-sm border"
              aria-label="User menu"
              type="button"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={handleProfileClick}>
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleLogout}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button 
          onClick={handleGetStarted} 
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-background/50 backdrop-blur-sm border"
          type="button"
        >
          <User className="h-5 w-5" />
        </Button>
      )}
      
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
        defaultTab={authTab}
      />
      <ProfileModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
      />
    </div>
  );
};
