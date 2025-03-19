
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Features } from "./Features";

interface FeaturesSectionProps {
  isVisible: boolean;
}

export const FeaturesSection = ({ isVisible }: FeaturesSectionProps) => {
  const { t } = useLanguage();
  
  return (
    <section id="features" className="py-16">
      <div className="container px-4 sm:px-6">
        <div className={cn(
          "flex flex-col items-center transition-all duration-1000 transform",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        )}>
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
            {t("everythingToExcel")}
          </h2>
          <Features />
        </div>
      </div>
    </section>
  );
};
