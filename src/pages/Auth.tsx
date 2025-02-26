
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { NavigationBar } from "@/components/navigation/NavigationBar";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthFeatures } from "@/components/auth/AuthFeatures";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [confirmingEmail, setConfirmingEmail] = useState(true);

  useEffect(() => {
    // Check for confirmation email success
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    
    if (type === 'recovery' || type === 'signup') {
      navigate('/profile');
      toast({
        title: "Email confirmed!",
        description: "Your email has been confirmed. Welcome!",
      });
    }
    setConfirmingEmail(false);
  }, [navigate, toast]);

  if (confirmingEmail) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main className="flex min-h-[calc(100vh-4rem)] relative">
        <div className="grid lg:grid-cols-[1fr,1fr] w-full">
          {/* Left side - Auth Form */}
          <div className="flex items-center justify-center lg:justify-end px-4 py-8">
            <div className="w-full max-w-md lg:mr-8">
              <AuthForm />
            </div>
          </div>
          
          {/* Right side - Features */}
          <div className="hidden lg:block relative bg-primary/5">
            <AuthFeatures />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
