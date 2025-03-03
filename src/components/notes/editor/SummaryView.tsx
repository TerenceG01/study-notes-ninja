
import { Card } from "@/components/ui/card";
import { Note } from "@/hooks/useNotes";

interface SummaryViewProps {
  editingNote: Note | null;
}

export const SummaryView = ({ editingNote }: SummaryViewProps) => {
  if (!editingNote?.summary) return null;
  
  return (
    <Card className="p-6 bg-muted h-full overflow-auto rounded-lg border-none shadow-none">
      <div className="prose max-w-none">
        {editingNote.summary.split('\n').map((line, index) => (
          <p key={index} className="mb-3 text-foreground/90">{line}</p>
        ))}
      </div>
    </Card>
  );
};
