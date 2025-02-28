
import { supabase } from "@/integrations/supabase/client";
import { Note, NewNote } from "./types";
import { getOfflineNotes } from "./offline-storage";

export const fetchNotes = async (): Promise<Note[]> => {
  console.log("Fetching notes...");
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  console.log("Fetched notes:", data);
  
  // If we're offline, merge with any offline notes
  if (!navigator.onLine) {
    const offlineNotes = getOfflineNotes();
    return [...offlineNotes, ...(data || [])] as Note[];
  }
  
  return data || [];
};

export const createNoteInDb = async (newNote: NewNote, userId: string) => {
  if (!newNote.title || !newNote.content) {
    throw new Error("Missing fields: Please fill in both title and content.");
  }
  
  console.log("Creating note:", { ...newNote, user_id: userId });
  const { error } = await supabase.from("notes").insert([
    {
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags,
      subject: newNote.subject,
      user_id: userId,
    },
  ]);

  if (error) throw error;
  return { success: true } as const;
};

export const generateFlashcardsForNote = async (note: Note) => {
  const { data, error } = await supabase.functions.invoke('generate-flashcards', {
    body: {
      noteId: note.id,
      content: note.content,
      title: note.title,
    },
  });

  if (error) throw error;
  return data;
};

export const deleteNotesForSubject = async (subject: string) => {
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("subject", subject);

  if (error) throw error;
  return subject;
};

export const syncOfflineNotes = async (userId: string): Promise<{syncedCount: number, totalCount: number}> => {
  const offlineNotes = getOfflineNotes();
  
  if (offlineNotes.length === 0) {
    return { syncedCount: 0, totalCount: 0 };
  }
  
  let syncedCount = 0;
  
  for (const note of offlineNotes) {
    try {
      const { error } = await supabase.from("notes").insert([
        {
          title: note.title,
          content: note.content,
          tags: note.tags,
          subject: note.subject,
          user_id: userId,
        },
      ]);
      
      if (!error) {
        syncedCount++;
      }
    } catch (error) {
      console.error("Error syncing offline note:", error);
    }
  }
  
  return { syncedCount, totalCount: offlineNotes.length };
};
