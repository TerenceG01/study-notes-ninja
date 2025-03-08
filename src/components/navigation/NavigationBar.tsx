
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { User } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { ProfileModal } from "@/components/profile/ProfileModal";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NavigationBar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [authTab, setAuthTab] = useState<"sign-in" | "sign-up">("sign-in");

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/" className="text-lg sm:text-xl font-bold text-primary truncate">
              StudyNotes
            </Link>
          </div>
          
          <div className="flex gap-3 sm:gap-4 items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" aria-label="User menu">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setShowProfileModal(true)}>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleLogout}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  onClick={handleGetStarted} 
                  className="text-xs sm:text-sm py-1 px-3 sm:py-2 sm:px-4 h-auto"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
        defaultTab={authTab}
      />
      <ProfileModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
      />
    </nav>
  );
};
