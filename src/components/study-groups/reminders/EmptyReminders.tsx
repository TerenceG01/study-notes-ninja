
import { CalendarDays } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmptyRemindersProps {
  userRole?: string;
}

export function EmptyReminders({ userRole }: EmptyRemindersProps) {
  const { t } = useLanguage();
  
  return (
    <div className="py-6 text-center">
      <CalendarDays className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
      <p className="text-sm text-muted-foreground">
        {t("noRemindersYet")}
      </p>
      {userRole && (
        <p className="text-xs text-muted-foreground mt-1">
          {t("addDates")}
        </p>
      )}
    </div>
  );
}
