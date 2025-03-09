
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const NotesTableHeader: React.FC = () => {
  return (
    <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
      <TableRow>
        <TableHead className="font-semibold text-primary w-[20%] text-xs sm:text-sm px-1 sm:px-4 max-w-[80px] sm:max-w-[100px]">Subject</TableHead>
        <TableHead className="w-[20%] text-xs sm:text-sm px-1 sm:px-4 max-w-[80px] sm:max-w-[100px]">Title</TableHead>
        <TableHead className="hidden md:table-cell w-[30%] text-xs sm:text-sm px-1 sm:px-4">Content</TableHead>
        <TableHead className="hidden sm:table-cell w-[10%] text-xs sm:text-sm px-1 sm:px-4">Created</TableHead>
        <TableHead className="w-[20%] text-xs sm:text-sm px-1 sm:px-4 max-w-[90px] sm:max-w-[110px] lg:max-w-full">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
