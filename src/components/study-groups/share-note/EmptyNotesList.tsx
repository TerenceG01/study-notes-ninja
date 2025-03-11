
import React from "react";
import { FileText } from "lucide-react";

export const EmptyNotesList: React.FC = () => {
  return (
    <div className="text-center py-8">
      <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
      <p className="text-muted-foreground">No notes found</p>
    </div>
  );
};
