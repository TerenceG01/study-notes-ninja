
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";
import Flashcards from "./pages/Flashcards";
import FlashcardDeck from "./pages/FlashcardDeck";
import StudyGroups from "./pages/StudyGroups";
import StudyGroupDetails from "./pages/StudyGroupDetails";
import JoinStudyGroup from "./pages/JoinStudyGroup";
import NotFound from "./pages/NotFound";
import { useAuth } from "./contexts/AuthContext";
import { NavigationBar } from "./components/navigation/NavigationBar";
import { NotesSidebar } from "./components/notes/NotesSidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { ThemeProvider } from "next-themes";

const ProtectedRoute = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

const AppLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen">
      <NavigationBar />
      <div className="flex min-h-[calc(100vh-4rem)] pt-16">
        <NotesSidebar />
        <div className="flex-1 relative">
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

const MainLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen">
      <NavigationBar />
      <main className="container mx-auto sm:px-6 lg:px-8 max-w-[1400px] px-[240px]">
        {children}
      </main>
    </div>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <SidebarProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<MainLayout><Index /></MainLayout>} />
                <Route path="/auth" element={<MainLayout><Auth /></MainLayout>} />
                <Route path="/notes" element={<ProtectedRoute><AppLayout><Notes /></AppLayout></ProtectedRoute>} />
                <Route path="/flashcards" element={<ProtectedRoute><AppLayout><Flashcards /></AppLayout></ProtectedRoute>} />
                <Route path="/flashcards/:id" element={<ProtectedRoute><AppLayout><FlashcardDeck /></AppLayout></ProtectedRoute>} />
                <Route path="/study-groups" element={<ProtectedRoute><AppLayout><StudyGroups /></AppLayout></ProtectedRoute>} />
                <Route path="/study-groups/:id" element={<ProtectedRoute><AppLayout><StudyGroupDetails /></AppLayout></ProtectedRoute>} />
                <Route path="/study-groups/join/:code" element={<ProtectedRoute><AppLayout><JoinStudyGroup /></AppLayout></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SidebarProvider>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
