
import { NoteCardSkeleton } from "@/components/ui/loading-skeletons";

export const NotesLoading = () => {
  return (
    <div className="p-6">
      <div className="space-y-2 mb-6">
        <div className="h-7 w-40 bg-muted rounded-md animate-pulse" />
        <div className="h-4 w-60 bg-muted/70 rounded-md animate-pulse" />
      </div>
      <NoteCardSkeleton />
    </div>
  );
};
