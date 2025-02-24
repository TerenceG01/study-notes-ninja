
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { NavigationBar } from "@/components/navigation/NavigationBar";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthFeatures } from "@/components/auth/AuthFeatures";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background relative">
      <NavigationBar />
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-1/2 h-full bg-[#D6BCFA]/10 absolute right-0" />
      </div>
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] relative">
        <div className="container grid lg:grid-cols-2 gap-8 px-4 py-8 items-center max-w-6xl mx-auto">
          <AuthForm />
          <AuthFeatures />
        </div>
      </main>
    </div>
  );
};

export default Auth;
