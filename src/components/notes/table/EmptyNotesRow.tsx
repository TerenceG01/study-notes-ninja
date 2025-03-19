
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";

export const EmptyNotesRow: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-8">
        <p className="text-muted-foreground">{t("noNotesFound")}</p>
      </TableCell>
    </TableRow>
  );
};
