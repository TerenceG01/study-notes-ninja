
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface CTASectionProps {
  isVisible: boolean;
  handleGetStarted: () => void;
}

export const CTASection = ({ isVisible, handleGetStarted }: CTASectionProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleNavigateToNotes = () => {
    navigate('/notes');
  };
  
  return (
    <section id="cta" className="py-24 bg-primary/5">
      <div className="container px-4 sm:px-6 mx-auto max-w-5xl">
        <div className={cn(
          "flex flex-col items-center justify-center space-y-8 text-center transition-all duration-1000 transform",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        )}>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t("readyToElevate")}
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {t("joinThousands")}
          </p>
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
            <Button 
              size="lg" 
              className="rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/25"
              onClick={handleGetStarted}
            >
              {t("getStartedFree")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
