
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroSectionProps {
  isVisible: boolean;
  handleGetStarted: () => void;
  handleSignIn: () => void;
}

export const HeroSection = ({
  isVisible,
  handleGetStarted,
  handleSignIn
}: HeroSectionProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleNavigateToNotes = () => {
    navigate('/notes');
  };

  return (
    <section id="hero" className="relative pt-16 pb-12 lg:pt-20 lg:pb-16 min-h-[85vh] flex items-center">
      <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-center text-center">
          <div className={cn(
            "space-y-8 max-w-2xl mx-auto transition-all duration-1000 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          )}>
            <div className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 transition-all duration-700",
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            )}>
              <Sparkles className="w-4 h-4 mr-2" />
              {t("smartNoteTaking")}
            </div>
            
            <h1 className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold leading-tight transition-all duration-1000 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <span className="block mb-2">{t("transformNotes")}</span>
            </h1>
            
            <p className={cn(
              "text-lg md:text-xl text-muted-foreground transition-all duration-1000 delay-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              {t("intelligentNoteTaking")}
            </p>
            
            <div className={cn(
              "flex flex-wrap gap-4 justify-center transition-all duration-1000 delay-400",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              {user ? (
                <Button 
                  size="lg" 
                  className="rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/25" 
                  onClick={handleNavigateToNotes}
                >
                  {t("goToMyNotes")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/25" 
                    onClick={handleGetStarted}
                  >
                    {t("getStartedFree")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="rounded-full border-primary/20 hover:bg-primary/5" 
                    onClick={handleSignIn}
                  >
                    {t("signIn")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
