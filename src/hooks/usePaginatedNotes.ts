
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Note } from "./notes/types";

export const usePaginatedNotes = (userId: string | undefined, pageSize = 10) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [totalNotes, setTotalNotes] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{
    subject?: string;
    color?: string;
    date?: string;
    search?: string;
  }>({});
  const { toast } = useToast();

  const totalPages = Math.ceil(totalNotes / pageSize);

  const fetchNotes = async (page = 1) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from("notes")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      // Apply filters
      if (filters.subject) {
        query = query.eq("subject", filters.subject);
      }
      
      if (filters.color) {
        query = query.eq("subject_color", filters.color);
      }
      
      if (filters.date) {
        // Assuming date is in ISO format
        query = query.gte("created_at", filters.date)
          .lt("created_at", new Date(new Date(filters.date).getTime() + 86400000).toISOString());
      }
      
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
      }
      
      // Calculate pagination range
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error, count } = await query.range(from, to);

      if (error) throw error;
      
      setNotes(data || []);
      setTotalNotes(count || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast({
        variant: "destructive",
        title: "Error fetching notes",
        description: "Failed to load your notes. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchNotes(currentPage);
  }, [userId, filters]); // Re-fetch when userId or filters change

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchNotes(page);
  };

  const applyFilters = (newFilters: typeof filters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  return {
    notes,
    loading,
    currentPage,
    totalPages,
    goToPage,
    applyFilters,
    refresh: () => fetchNotes(currentPage),
  };
};
