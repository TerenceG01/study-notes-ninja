
import { useState, useEffect } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./alert-dialog";
import { Button } from "./button";
import { X } from "lucide-react";
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
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Cookie Disclaimer</AlertDialogTitle>
          <X 
            className="absolute top-4 right-4 h-4 w-4 cursor-pointer opacity-70 hover:opacity-100" 
            onClick={() => setOpen(false)}
          />
          <AlertDialogDescription>
            This website uses cookies to enhance your browsing experience, 
            personalize content and ads, provide social media features, and analyze our traffic. 
            By clicking "Accept All", you consent to our use of cookies.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={handleReject}>
            Reject All
          </Button>
          <Button onClick={handleAccept}>
            Accept All
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
