
import { FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const EmptyNotes = () => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center py-8">
      <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
      <p className="text-muted-foreground">{t("noNotesYet")}</p>
    </div>
  );
};
