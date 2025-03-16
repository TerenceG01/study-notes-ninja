import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Notes from "./pages/Notes";
import Flashcards from "./pages/Flashcards";
import FlashcardDeck from "./pages/FlashcardDeck";
import StudyGroups from "./pages/StudyGroups";
import StudyGroupDetails from "./pages/StudyGroupDetails";
import JoinStudyGroup from "./pages/JoinStudyGroup";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import { useAuth } from "./contexts/AuthContext";
import { MobileNavigationBar } from "./components/navigation/MobileNavigationBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { NotesSidebar } from "./components/notes/NotesSidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import { ResponsiveContainer } from "./components/ui/responsive-container";
import { ProfileButton } from "./components/navigation/ProfileButton";
import { BrowserRouter } from "react-router-dom";
import { NoteModelProvider } from "./contexts/NoteModelContext";
import { TourProvider } from "./contexts/TourContext";
import { AppTour } from "./components/onboarding/AppTour";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isIndex = location.pathname === '/';
  
  return (
    <div className="min-h-screen">
      <ProfileButton />
      <div className={`flex min-h-screen ${isMobile && !isIndex ? 'pb-14' : ''}`}>
        <NotesSidebar />
        <div className="flex-1 relative">
          <main className="px-2 sm:px-4">{children}</main>
        </div>
      </div>
      {isMobile && !isIndex && <MobileNavigationBar />}
    </div>
  );
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isIndex = location.pathname === '/';
  
  return (
    <div className="min-h-screen">
      <ProfileButton />
      <ResponsiveContainer className={`${isMobile && !isIndex ? 'pb-14' : ''}`}>
        {children}
      </ResponsiveContainer>
      {isMobile && !isIndex && <MobileNavigationBar />}
    </div>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Toaster />
        <NoteModelProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <TourProvider>
                <AppTour />
                <Routes>
                  <Route path="/" element={<MainLayout><Index /></MainLayout>} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route
                    path="/notes"
                    element={<ProtectedRoute><AppLayout><Notes /></AppLayout></ProtectedRoute>}
                  />
                  <Route
                    path="/flashcards"
                    element={<ProtectedRoute><AppLayout><Flashcards /></AppLayout></ProtectedRoute>}
                  />
                  <Route
                    path="/flashcards/:id"
                    element={<ProtectedRoute><AppLayout><FlashcardDeck /></AppLayout></ProtectedRoute>}
                  />
                  <Route
                    path="/study-groups"
                    element={<ProtectedRoute><AppLayout><StudyGroups /></AppLayout></ProtectedRoute>}
                  />
                  <Route
                    path="/study-groups/:id"
                    element={<ProtectedRoute><AppLayout><StudyGroupDetails /></AppLayout></ProtectedRoute>}
                  />
                  <Route
                    path="/study-groups/join/:code"
                    element={<ProtectedRoute><AppLayout><JoinStudyGroup /></AppLayout></ProtectedRoute>}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TourProvider>
            </AuthProvider>
          </QueryClientProvider>
        </NoteModelProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
