import { Link } from "react-router-dom";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { NavigationItems } from "./NavigationItems";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { AuthDialog } from "../auth/AuthDialog";
export const NavigationBar = () => {
  const {
    user
  } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  return <>
      <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        
      </header>
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} defaultTab="sign-in" />
    </>;
};