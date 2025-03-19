
import { Check, Globe } from "lucide-react";
import { LanguageCode, languages, useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface LanguageSelectorProps {
  variant?: "minimal" | "full";
}

export const LanguageSelector = ({ variant = "full" }: LanguageSelectorProps) => {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={variant === "minimal" ? "icon" : "sm"}
          className={variant === "minimal" ? "w-8 h-8 rounded-full" : ""}
        >
          {variant === "minimal" ? (
            <Globe className="h-4 w-4" />
          ) : (
            <>
              <Globe className="h-4 w-4 mr-2" />
              {t("selectLanguage")}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([code, lang]) => (
          <DropdownMenuItem
            key={code}
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setLanguage(code as LanguageCode)}
          >
            <span>{lang.name}</span>
            {language === code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
