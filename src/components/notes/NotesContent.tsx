import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { NotesTable } from "./NotesTable";
import { EditNoteDialog } from "./EditNoteDialog";
import { useNotes, type Note } from "@/hooks/useNotes";
import { useNoteEditor } from "@/hooks/useNoteEditor";
import { useNoteSummary } from "@/hooks/useNoteSummary";
import { CreateNoteContainer } from "./CreateNoteContainer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { CommonSubjects } from "./CommonSubjects";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter, Palette, Tag, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SUBJECT_COLORS = [
  { name: 'Blue', value: 'blue', class: 'bg-blue-100' },
  { name: 'Green', value: 'green', class: 'bg-green-100' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-100' },
  { name: 'Red', value: 'red', class: 'bg-red-100' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-100' },
];

export const NotesContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const currentSubject = searchParams.get("subject");
  
  // Filter states
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const { notes: allNotes, loading, generatingFlashcardsForNote, fetchNotes, createNote, generateFlashcards, deleteNotesForSubject } = useNotes();
  const { 
    newNote, 
    newTag, 
    isEditorExpanded,
    setIsEditorExpanded, 
    setNewTag, 
    handleNoteChange, 
    addTag, 
    removeTag, 
    resetEditor 
  } = useNoteEditor();
  const {
    summarizing,
    summaryLevel,
    showSummary,
    setSummaryLevel,
    setShowSummary,
    generateSummary,
  } = useNoteSummary();
  
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  // Get unique subjects from notes
  const uniqueSubjects = Array.from(new Set(allNotes.map(note => note.subject).filter(Boolean)));

  // Apply filters
  const filteredNotes = allNotes.filter(note => {
    const matchesColor = !selectedColor || note.subject_color === selectedColor;
    const matchesSubject = !selectedSubject || note.subject === selectedSubject;
    const matchesDate = !selectedDate || 
      format(new Date(note.created_at), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    return matchesColor && matchesSubject && matchesDate;
  });

  const clearFilters = () => {
    setSelectedColor(null);
    setSelectedSubject(null);
    setSelectedDate(null);
  };

  const handleCreateNote = async () => {
    if (!user) return;
    const success = await createNote(newNote, user.id);
    if (success) {
      resetEditor();
      toast({
        title: "Success",
        description: "Note created successfully!",
      });
    }
  };

  const handleGenerateSummary = async () => {
    if (!selectedNote || !editingNote) return;
    const summary = await generateSummary(selectedNote);
    if (summary) {
      setEditingNote(prev => prev ? { ...prev, summary } : null);
      setShowSummary(true);
    }
  };

  const updateNote = async () => {
    if (!editingNote) return;

    try {
      const { error } = await supabase
        .from("notes")
        .update({
          title: editingNote.title,
          content: editingNote.content,
          summary: editingNote.summary,
          tags: editingNote.tags || [],
          subject: editingNote.subject,
        })
        .eq("id", editingNote.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note updated successfully!",
      });

      setSelectedNote(null);
      setEditingNote(null);
      setShowSummary(false);
      fetchNotes();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating note",
        description: "Failed to update note. Please try again.",
      });
    }
  };

  return (
    <div className="mx-auto max-w-[min(100%,64rem)]">
      <CreateNoteContainer
        isExpanded={isEditorExpanded}
        note={newNote}
        newTag={newTag}
        commonSubjects={CommonSubjects}
        onNoteChange={handleNoteChange}
        onTagChange={setNewTag}
        onAddTag={addTag}
        onRemoveTag={removeTag}
        onCancel={resetEditor}
        onSave={handleCreateNote}
      />

      <Card className="shadow-sm border-muted/20">
        <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-medium">Your Notes</CardTitle>
              <CardDescription>Browse and manage your existing notes</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {/* Color Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex items-center gap-2",
                      selectedColor && "border-primary"
                    )}
                  >
                    <Palette className="h-4 w-4" />
                    Color
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="grid grid-cols-2 gap-1">
                    {SUBJECT_COLORS.map(color => (
                      <Button
                        key={color.value}
                        variant="ghost"
                        className={cn(
                          "justify-start",
                          color.class,
                          selectedColor === color.value && "border-2 border-primary"
                        )}
                        onClick={() => setSelectedColor(color.value)}
                      >
                        {color.name}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Subject Filter */}
              <Select value={selectedSubject || ""} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueSubjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex items-center gap-2",
                      selectedDate && "border-primary"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PP') : 'Date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Clear Filters */}
              {(selectedColor || selectedSubject || selectedDate) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-primary"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
          {/* Active Filters Display */}
          {(selectedColor || selectedSubject || selectedDate) && (
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filtering by:</span>
              {selectedColor && (
                <span className={cn(
                  "px-2 py-1 rounded-md",
                  SUBJECT_COLORS.find(c => c.value === selectedColor)?.class
                )}>
                  {SUBJECT_COLORS.find(c => c.value === selectedColor)?.name}
                </span>
              )}
              {selectedSubject && (
                <span className="px-2 py-1 bg-secondary rounded-md">
                  {selectedSubject}
                </span>
              )}
              {selectedDate && (
                <span className="px-2 py-1 bg-secondary rounded-md">
                  {format(selectedDate, 'PP')}
                </span>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <NotesTable
            notes={filteredNotes}
            loading={loading}
            generatingFlashcardsForNote={generatingFlashcardsForNote}
            onNoteClick={(note) => {
              setSelectedNote(note);
              setEditingNote(note);
              setShowSummary(false);
            }}
            onGenerateFlashcards={generateFlashcards}
            onNotesChanged={fetchNotes}
          />
        </CardContent>
      </Card>

      <EditNoteDialog
        open={!!selectedNote}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedNote(null);
            setEditingNote(null);
            setShowSummary(false);
          }
        }}
        selectedNote={selectedNote}
        editingNote={editingNote}
        showSummary={showSummary}
        summaryLevel={summaryLevel}
        summarizing={summarizing}
        newTag={newTag}
        commonSubjects={CommonSubjects}
        onNoteChange={setEditingNote}
        onSummaryLevelChange={setSummaryLevel}
        onGenerateSummary={handleGenerateSummary}
        onToggleSummary={() => setShowSummary(!showSummary)}
        onNewTagChange={setNewTag}
        onSave={updateNote}
      />
    </div>
  );
}
