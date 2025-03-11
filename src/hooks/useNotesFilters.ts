
import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { Note } from "@/hooks/useNotes";

export const useNotesFilters = (allNotes: Note[]) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSubject = searchParams.get("subject");
  
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract unique subjects and sort them alphabetically
  const uniqueSubjects = Array.from(new Set(
    allNotes
      .map(note => note.subject)
      .filter(Boolean)
  )).sort((a, b) => a.localeCompare(b));

  // Filter notes based on multiple criteria
  const filteredNotes = allNotes.filter(note => {
    const matchesColor = !selectedColor || note.subject_color === selectedColor;
    const matchesSubject = !currentSubject || note.subject === currentSubject;
    const matchesDate = !selectedDate || 
      format(new Date(note.created_at), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    const matchesSearch = !searchQuery || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.subject?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    return matchesColor && matchesSubject && matchesDate && matchesSearch;
  });

  // Clear all active filters
  const clearFilters = useCallback(() => {
    setSelectedColor(null);
    setSelectedDate(null);
    setSearchQuery("");
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("subject");
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams]);

  return {
    selectedColor,
    setSelectedColor,
    selectedDate,
    setSelectedDate,
    searchQuery,
    setSearchQuery,
    currentSubject,
    uniqueSubjects,
    filteredNotes,
    clearFilters,
  };
};
