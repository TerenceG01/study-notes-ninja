
import { Link } from "react-router-dom";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { NavigationItems } from "./NavigationItems";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { AuthDialog } from "../auth/AuthDialog";

export const NavigationBar = () => {
  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-[1400px] items-center">
          <div className="mr-8">
            <Link to="/" className="flex items-center space-x-2">
              <Icons.logo className="h-6 w-6" />
              <span className="font-bold inline-block">StudyNotes</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <NavigationItems />
            </div>
            <nav className="flex items-center">
              {user ? (
                <Link
                  to="/notes"
                  className={buttonVariants({
                    variant: "default",
                  })}
                >
                  Go to App
                </Link>
              ) : (
                <button
                  onClick={() => setShowAuthDialog(true)}
                  className={buttonVariants({
                    variant: "ghost",
                  })}
                >
                  Sign In
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
        defaultTab="sign-in"
      />
    </>
  );
};
