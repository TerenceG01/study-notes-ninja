
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTour } from "@/contexts/TourContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { NavigationBar } from "@/components/navigation/NavigationBar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CTASection } from "@/components/landing/CTASection";
import { useVisibilityObserver } from "@/components/landing/useVisibilityObserver";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { user } = useAuth();
  const { startTour } = useTour();
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<"sign-in" | "sign-up">("sign-up");
  const { t } = useLanguage();
  
  // Section visibility with custom hook
  const isVisible = useVisibilityObserver([
    'hero', 
    'features', 
    'howItWorks', 
    'testimonials', 
    'cta'
  ]);

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
      
      {/* Hero Section */}
      <HeroSection 
        isVisible={isVisible.hero} 
        handleGetStarted={handleGetStarted}
        handleSignIn={handleSignIn}
      />
      
      {/* Features Section */}
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
    </div>
  );
};

export default Index;
