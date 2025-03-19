
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";

export const EmptyNotesRow: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-8">
        <p className="text-muted-foreground">No notes found. Create your first note above!</p>
      </TableCell>
    </TableRow>
  );
};
