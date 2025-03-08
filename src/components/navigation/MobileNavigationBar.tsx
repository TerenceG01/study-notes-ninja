
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Home, BookOpen, FileText, Users, User } from "lucide-react";
import { ProfileModal } from "@/components/profile/ProfileModal";

export const MobileNavigationBar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const location = useLocation();

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
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t py-2 md:hidden">
        <div className="flex justify-around items-center">
          <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          {user && (
            <>
              <Link to="/notes" className={`flex flex-col items-center ${location.pathname === '/notes' ? 'text-primary' : 'text-muted-foreground'}`}>
                <FileText className="h-5 w-5" />
                <span className="text-xs mt-1">Notes</span>
              </Link>
              
              <Link to="/flashcards" className={`flex flex-col items-center ${location.pathname === '/flashcards' ? 'text-primary' : 'text-muted-foreground'}`}>
                <BookOpen className="h-5 w-5" />
                <span className="text-xs mt-1">Cards</span>
              </Link>
              
              <Link to="/study-groups" className={`flex flex-col items-center ${location.pathname === '/study-groups' ? 'text-primary' : 'text-muted-foreground'}`}>
                <Users className="h-5 w-5" />
                <span className="text-xs mt-1">Groups</span>
              </Link>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 flex flex-col items-center text-muted-foreground"
                onClick={() => setShowProfileModal(true)}
              >
                <User className="h-5 w-5" />
                <span className="text-xs mt-1">Profile</span>
              </Button>
            </>
          )}
          
          {!user && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 flex flex-col items-center text-muted-foreground"
              onClick={() => setShowProfileModal(true)}
            >
              <User className="h-5 w-5" />
              <span className="text-xs mt-1">Login</span>
            </Button>
          )}
        </div>
      </div>
      
      <ProfileModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
      />
    </>
  );
};
