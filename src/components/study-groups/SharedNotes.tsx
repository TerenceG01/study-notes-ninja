
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";
import { format } from "date-fns";

interface SharedNote {
  notes: {
    id: string;
    title: string;
    content: string;
    created_at: string;
  };
  shared_by: string;
  shared_at: string;
  shared_by_profile: {
    username: string | null;
    full_name: string | null;
  } | null;
}

interface SharedNotesProps {
  groupId: string;
}

export const SharedNotes = ({ groupId }: SharedNotesProps) => {
  const { data: notes, isLoading } = useQuery({
    queryKey: ['group-shared-notes', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_group_notes')
        .select(`
          notes (
            id,
            title,
            content,
            created_at
          ),
          shared_by,
          shared_at,
          shared_by_profile:profiles (
            username,
            full_name
          )
        `)
        .eq('group_id', groupId);

      if (error) throw error;
      return data as unknown as SharedNote[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No notes have been shared yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.notes.id}>
          <CardHeader>
            <CardTitle>{note.notes.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {note.notes.content.substring(0, 200)}...
            </p>
            <div className="text-xs text-muted-foreground">
              Shared by {note.shared_by_profile?.username || note.shared_by_profile?.full_name || 'Unknown'} on{' '}
              {format(new Date(note.shared_at), 'PPP')}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
