
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";

export const NotesTableHeader: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
      <TableRow>
        <TableHead className="font-semibold text-primary w-[20%] text-xs sm:text-sm px-1 sm:px-4 max-w-[80px] sm:max-w-[100px]">{t("subject")}</TableHead>
        <TableHead className="w-[20%] text-xs sm:text-sm px-1 sm:px-4 max-w-[80px] sm:max-w-[100px]">{t("title")}</TableHead>
        <TableHead className="hidden md:table-cell w-[30%] text-xs sm:text-sm px-1 sm:px-4">{t("content")}</TableHead>
        <TableHead className="hidden sm:table-cell w-[10%] text-xs sm:text-sm px-1 sm:px-4">{t("created")}</TableHead>
        <TableHead className="w-[20%] text-xs sm:text-sm px-1 sm:px-4 max-w-[90px] sm:max-w-[110px] lg:max-w-full">{t("actions")}</TableHead>
      </TableRow>
    </TableHeader>
  );
};
