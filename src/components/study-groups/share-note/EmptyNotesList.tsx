
import React from "react";
import { FileText, SearchX } from "lucide-react";

interface EmptyNotesListProps {
  isFiltered?: boolean;
}

export const EmptyNotesList: React.FC<EmptyNotesListProps> = ({ isFiltered = false }) => {
  return (
    <div className="text-center py-8 flex flex-col items-center">
      {isFiltered ? (
        <>
          <SearchX className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No notes match your search</p>
          <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
        </>
      ) : (
        <>
          <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No notes found</p>
          <p className="text-xs text-muted-foreground mt-1">Create some notes to share with your group</p>
        </>
      )}
    </div>
  );
};
