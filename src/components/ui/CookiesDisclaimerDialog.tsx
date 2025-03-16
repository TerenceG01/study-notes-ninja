
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
          <div className="flex items-center justify-center mb-2">
            <Cookie className="h-8 w-8 text-amber-500 mr-2 animate-bounce-subtle" />
            <AlertDialogTitle className="text-xl">Cookie Disclaimer</AlertDialogTitle>
          </div>
          
          <X 
            className="absolute top-0 right-0 h-4 w-4 cursor-pointer opacity-70 hover:opacity-100" 
            onClick={() => setOpen(false)}
          />
          
          <div className="flex flex-col sm:flex-row items-center mb-4">
            <div className="relative w-24 h-24 shrink-0 rounded-full overflow-hidden mr-0 sm:mr-4 mb-4 sm:mb-0 border-2 border-amber-300">
              <img 
                src="/placeholder.svg" 
                alt="Cookies" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent" />
            </div>
            
            <AlertDialogDescription className="text-center sm:text-left">
              This website uses cookies to enhance your browsing experience, 
              personalize content and ads, provide social media features, and analyze our traffic. 
              By clicking "Accept All", you consent to our use of cookies.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="relative">
          <Button 
            variant="outline" 
            onClick={handleReject}
            className="border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30"
          >
            Reject All
          </Button>
          <Button 
            onClick={handleAccept}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            <Cookie className="h-4 w-4 mr-2" />
            Accept All
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
