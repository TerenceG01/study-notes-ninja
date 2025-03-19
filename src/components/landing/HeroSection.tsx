
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroSectionProps {
  isVisible: boolean;
  handleGetStarted: () => void;
  handleSignIn: () => void;
}

export const HeroSection = ({ isVisible, handleGetStarted, handleSignIn }: HeroSectionProps) => {
  const { t } = useLanguage();
  
  return (
    <section id="hero" className="pt-24 pb-16">
      <div className="container px-4 sm:px-6">
        <div className={cn(
          "flex flex-col items-center text-center transition-all duration-1000 transform",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        )}>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-secondary text-primary mb-8 inline-block animate-fade-in">
            {t("smartNoteTaking")}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight max-w-4xl">
            {t("transformNotes")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
            {t("intelligentNoteTaking")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleGetStarted}
              className="px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t("getStartedFree")}
            </button>
            <button 
              onClick={handleSignIn}
              className="px-6 py-3 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {t("signIn")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
