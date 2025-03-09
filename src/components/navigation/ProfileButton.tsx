
import { useState } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { ProfileModal } from "@/components/profile/ProfileModal";

export const ProfileButton = () => {
  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [authTab, setAuthTab] = useState<"sign-in" | "sign-up">("sign-in");

  const handleSignIn = () => {
    setAuthTab("sign-in");
    setShowAuthDialog(true);
  };

  const handleProfileClick = () => {
    setShowProfileModal(prev => !prev);
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        {user ? (
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full" 
            onClick={handleProfileClick}
          >
            <User className="h-4 w-4" />
          </Button>
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
      <ProfileModal open={showProfileModal} onOpenChange={setShowProfileModal} />
    </>
  );
};
