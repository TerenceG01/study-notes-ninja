
import { useState, useEffect } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./alert-dialog";
import { Button } from "./button";
import { X, Cookie } from "lucide-react";
import { toast } from "@/hooks/toast/toast";

export function CookiesDisclaimerDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem('cookiesAccepted');
    if (!hasAcceptedCookies) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setOpen(false);
    toast({
      title: "Cookies accepted",
      description: "Your preferences have been saved"
    });
  };

  const handleReject = () => {
    // We still store the user's choice so we don't show the dialog again
    localStorage.setItem('cookiesAccepted', 'false');
    setOpen(false);
    toast({
      title: "Cookies rejected",
      description: "You can change your preferences in settings"
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-md overflow-hidden">
        <div className="absolute -right-16 -top-16 bg-primary/10 rounded-full w-32 h-32 blur-xl animate-pulse-slow" />
        <div className="absolute -left-16 -bottom-16 bg-primary/10 rounded-full w-32 h-32 blur-xl animate-pulse-slow" />
        
        <AlertDialogHeader className="relative">
          <div className="flex items-center justify-center mb-4">
            <Cookie className="h-8 w-8 text-primary mr-2 animate-bounce-subtle" />
            <AlertDialogTitle className="text-xl">Cookie Disclaimer</AlertDialogTitle>
          </div>
          
          <X 
            className="absolute top-0 right-0 h-4 w-4 cursor-pointer opacity-70 hover:opacity-100" 
            onClick={() => setOpen(false)}
          />
          
          <AlertDialogDescription className="text-center sm:text-left mb-2">
            This website uses cookies to enhance your browsing experience, 
            personalize content and ads, provide social media features, and analyze our traffic. 
            By clicking "Accept All", you consent to our use of cookies.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="relative mt-6 space-x-4 sm:space-x-6">
          <Button 
            variant="outline" 
            onClick={handleReject}
            className="border-primary/30 hover:bg-primary/5 dark:hover:bg-primary/10"
          >
            Reject All
          </Button>
          <Button 
            onClick={handleAccept}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Cookie className="h-4 w-4 mr-2" />
            Accept All
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
