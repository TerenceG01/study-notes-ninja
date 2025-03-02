
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const NotesTableHeader: React.FC = () => {
  return (
    <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
      <TableRow>
        <TableHead className="font-semibold text-primary w-[20%]">Subject</TableHead>
        <TableHead className="w-[20%]">Title</TableHead>
        <TableHead className="hidden md:table-cell w-[30%]">Content</TableHead>
        <TableHead className="hidden sm:table-cell w-[10%]">Created At</TableHead>
        <TableHead className="w-[20%]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
