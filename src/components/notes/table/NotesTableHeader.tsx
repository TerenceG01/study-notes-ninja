
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const NotesTableHeader: React.FC = () => {
  return (
    <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
      <TableRow>
        <TableHead className="font-semibold text-primary w-[15%] text-xs sm:text-sm px-2 sm:px-4">Subject</TableHead>
        <TableHead className="w-[20%] text-xs sm:text-sm px-2 sm:px-4">Title</TableHead>
        <TableHead className="hidden md:table-cell w-[35%] text-xs sm:text-sm px-2 sm:px-4">Content</TableHead>
        <TableHead className="hidden sm:table-cell w-[10%] text-xs sm:text-sm px-2 sm:px-4">Created At</TableHead>
        <TableHead className="w-[20%] text-xs sm:text-sm px-2 sm:px-4">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
