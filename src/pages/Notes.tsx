
import { useAuth } from "@/contexts/AuthContext";
import { NotesContent } from "@/components/notes/NotesContent";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const Notes = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen pt-6">
        <div className="container mx-auto max-w-[1400px] px-4 lg:px-8">
          <NotesContent />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default Notes;
