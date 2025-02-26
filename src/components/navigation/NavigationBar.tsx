
import { Link } from "react-router-dom";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { NavigationItems } from "./NavigationItems";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { AuthDialog } from "../auth/AuthDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserCircle } from "lucide-react";

export const NavigationBar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const fetchUsername = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setUsername(data.username);
        }
      };
      
      fetchUsername();
    }
  }, [user]);

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

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1.5">
              <UserCircle className="h-5 w-5 text-primary" />
              <span className="font-medium text-sm md:text-base">
                {username || "No username set"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className={buttonVariants({ 
                variant: "ghost",
                className: "hover:bg-primary/10 transition-colors duration-200"
              })}
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} defaultTab="sign-in" />
    </>
  );
};
