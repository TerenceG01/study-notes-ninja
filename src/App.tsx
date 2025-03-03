import React from 'react';
import { useState } from 'react';
import { Note, useNotes, SummaryLevel } from './hooks/useNotes';
import { EditNoteDialog } from './components/notes/EditNoteDialog';
import './App.css';
import './components/notes/editor.css';

function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    generateSummary,
    enhanceNote,
  } = useNotes();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryLevel, setSummaryLevel] = useState<SummaryLevel>('brief');
  const [summarizing, setSummarizing] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [commonSubjects, setCommonSubjects] = useState<string[]>([]);

  const handleOpenDialog = (note: Note | null) => {
    setSelectedNote(note);
    setEditingNote(note 
      ? { ...note } 
      : { 
          id: Date.now().toString(), 
          title: 'New Note', 
          content: '', 
          tags: [],
          created_at: new Date().toISOString(),
          folder: 'My Notes',
        } as Note);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedNote(null);
    setEditingNote(null);
    setShowSummary(false);
  };

  const handleNoteChange = (note: Note | null) => {
    setEditingNote(note ? { ...note } : null);
  };

  const handleSummaryLevelChange = (level: SummaryLevel) => {
    setSummaryLevel(level);
  };

  const handleGenerateSummary = async () => {
    if (!editingNote) return;

    setSummarizing(true);
    try {
      const summary = await generateSummary(editingNote.content, summaryLevel);
      setEditingNote({ ...editingNote, summary: summary });
    } catch (error) {
      console.error("Failed to generate summary:", error);
    } finally {
      setSummarizing(false);
    }
  };

  const handleToggleSummary = () => {
    setShowSummary(!showSummary);
  };

  const handleEnhanceNote = async (enhanceType: 'grammar' | 'structure') => {
    if (!editingNote) return;

    setEnhancing(true);
    try {
      const enhancedContent = await enhanceNote(editingNote.content, enhanceType);
      setEditingNote({ ...editingNote, content: enhancedContent });
    } catch (error) {
      console.error("Failed to enhance note:", error);
    } finally {
      setEnhancing(false);
    }
  };

  const handleSave = () => {
    if (!editingNote) return;

    if (selectedNote) {
      updateNote(editingNote);
    } else {
      addNote(editingNote);
    }
    handleCloseDialog();
  };

  return (
    <div className="App">
      <h1>My Notes App</h1>
      <button onClick={() => handleOpenDialog(null)}>Add New Note</button>
      <ul>
        {notes.map(note => (
          <li key={note.id}>
            <button onClick={() => handleOpenDialog(note)}>
              {note.title}
            </button>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <EditNoteDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedNote={selectedNote}
        editingNote={editingNote}
        showSummary={showSummary}
        summaryLevel={summaryLevel}
        summarizing={summarizing}
        enhancing={enhancing}
        commonSubjects={commonSubjects}
        onNoteChange={handleNoteChange}
        onSummaryLevelChange={handleSummaryLevelChange}
        onGenerateSummary={handleGenerateSummary}
        onToggleSummary={handleToggleSummary}
        onEnhanceNote={handleEnhanceNote}
        onSave={handleSave}
      />
    </div>
  );
}

export default App;
