
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { NavigationBar } from "@/components/navigation/NavigationBar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CTASection } from "@/components/landing/CTASection";
import { useVisibilityObserver } from "@/components/landing/useVisibilityObserver";
import { FeatureIntroduction } from "@/components/onboarding/FeatureIntroduction";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const { user, isFirstTimeUser, setIsFirstTimeUser } = useAuth();
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<"sign-in" | "sign-up">("sign-up");
  const [showIntroduction, setShowIntroduction] = useState(false);
  
  // Section visibility with custom hook
  const isVisible = useVisibilityObserver([
    'hero', 
    'features', 
    'howItWorks', 
    'testimonials', 
    'cta'
  ]);

  useEffect(() => {
    // If user is logged in and it's their first time, show the introduction
    if (user && isFirstTimeUser) {
      setShowIntroduction(true);
    }
  }, [user, isFirstTimeUser]);

  const handleIntroComplete = async () => {
    if (user) {
      // Update the user's profile to mark that they've seen the introduction
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ has_seen_intro: true })
          .eq('id', user.id);
          
        if (error) throw error;
        
        // Update local state
        setIsFirstTimeUser(false);
        toast({
          title: "Welcome to StudyMate!",
          description: "You're all set to start your learning journey."
        });
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/notes');
    } else {
      setAuthTab("sign-up");
      setShowAuthDialog(true);
    }
  };

  const handleSignIn = () => {
    setAuthTab("sign-in");
    setShowAuthDialog(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <NavigationBar />
      
      {/* Hero Section - Transform Notes into Lasting Knowledge */}
      <HeroSection 
        isVisible={isVisible.hero} 
        handleGetStarted={handleGetStarted}
        handleSignIn={handleSignIn}
      />
      
      {/* Features Section - Everything You Need to Excel (separated from Hero) */}
      <div className="py-20">
        <FeaturesSection isVisible={isVisible.features} />
      </div>
      
      <HowItWorksSection 
        isVisible={isVisible.howItWorks}
        handleGetStarted={handleGetStarted}
      />
      
      <TestimonialsSection isVisible={isVisible.testimonials} />
      
      <CTASection 
        isVisible={isVisible.cta}
        handleGetStarted={handleGetStarted}
      />
      
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
        defaultTab={authTab}
      />

      <FeatureIntroduction
        open={showIntroduction}
        onOpenChange={setShowIntroduction}
        onComplete={handleIntroComplete}
      />
    </div>
  );
};

export default Index;
