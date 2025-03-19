
import React from "react";
import { Check, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { languages, LanguageCode } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  variant?: "default" | "minimal";
  align?: "start" | "center" | "end";
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = "default",
  align = "end",
  className,
}) => {
  const { language, setLanguage, t } = useLanguage();

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-1 px-2",
            variant === "minimal" && "h-8 w-8 p-0",
            className
          )}
        >
          <Globe className="h-4 w-4" />
          {variant !== "minimal" && (
            <span className="text-sm font-normal">{languages[language].name}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-40">
        {Object.entries(languages).map(([code, { name }]) => (
          <DropdownMenuItem
            key={code}
            className="flex items-center justify-between cursor-pointer"
            onClick={() => handleSelectLanguage(code as LanguageCode)}
          >
            <span>{name}</span>
            {language === code && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
