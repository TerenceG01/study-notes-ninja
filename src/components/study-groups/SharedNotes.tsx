
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";
import { format } from "date-fns";
import { ViewSharedNote } from "./ViewSharedNote";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SharedNote {
  note: {
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
  const [selectedNote, setSelectedNote] = useState<SharedNote['note'] | null>(null);

  const { data: notes, isLoading } = useQuery({
    queryKey: ['group-shared-notes', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_group_notes')
        .select(`
          note:notes!study_group_notes_note_id_fkey (
            id,
            title,
            content,
            created_at
          ),
          shared_by,
          shared_at,
          shared_by_profile:profiles!study_group_notes_shared_by_profiles_fkey (
            username,
            full_name
          )
        `)
        .eq('group_id', groupId);

      if (error) throw error;
      return data as SharedNote[];
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
    <ScrollArea className="h-[400px]">
      <div className="space-y-3">
        {notes.map((note) => {
          const sharedByName = note.shared_by_profile?.username || 
                             note.shared_by_profile?.full_name || 
                             'Unknown';
          const initials = sharedByName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();

          return (
            <Card 
              key={note.note.id}
              className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border hover:border-accent"
              onClick={() => setSelectedNote(note.note)}
            >
              <CardHeader className="space-y-0 pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-1">{note.note.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {note.note.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{sharedByName}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(note.shared_at), 'MMM d')}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {selectedNote && (
        <ViewSharedNote
          note={selectedNote}
          open={!!selectedNote}
          onOpenChange={(open) => !open && setSelectedNote(null)}
        />
      )}
    </ScrollArea>
  );
};
