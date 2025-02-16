
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut, Tag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { navigationItems } from "@/components/navigation/NavigationItems";
import { useSearchParams } from "react-router-dom";
import { useNotes } from "@/hooks/useNotes";
import { useEffect, useState } from "react";

export function NotesSidebar() {
  const location = useLocation();
  const { toast } = useToast();
  const { state } = useSidebar();
  const isOpen = state === "expanded";
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSubject = searchParams.get("subject");
  const { notes } = useNotes();
  const [uniqueSubjects, setUniqueSubjects] = useState<string[]>([]);

  useEffect(() => {
    // Extract unique subjects from notes and sort them alphabetically
    const subjects = Array.from(new Set(notes.map(note => note.subject || "General")))
      .filter(Boolean)
      .sort();
    setUniqueSubjects(subjects);
  }, [notes]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } else {
      toast({
        title: "Signed out successfully",
      });
    }
  };

  const handleSubjectClick = (subject: string) => {
    if (currentSubject === subject) {
      // If clicking the current subject, remove the filter
      searchParams.delete("subject");
    } else {
      // Otherwise, set the new subject filter
      searchParams.set("subject", subject);
    }
    setSearchParams(searchParams);
  };

  if (isMobile && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Background Element */}
      <div className={cn(
        "fixed top-0 left-0 h-full bg-background/50 backdrop-blur-sm transition-all duration-300 z-0",
        isOpen ? "w-60" : "w-20"
      )} />
      
      <Sidebar className={cn(
        "border-r bg-primary/5 backdrop-blur-sm h-full transition-all duration-300 relative z-10",
        isOpen ? "w-40" : "w-20"
      )}>
        <SidebarHeader className="p-4 border-b">
          {isOpen && <h2 className="font-semibold">Navigation</h2>}
        </SidebarHeader>
        <SidebarContent className="flex flex-col h-full">
          <div className="space-y-2 p-2">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className={cn(
                  "w-full flex items-center",
                  isOpen ? "justify-start px-3" : "justify-center px-0",
                  location.pathname === item.path && "bg-accent/60"
                )}
                asChild
              >
                <Link to={item.path}>
                  <item.icon className="h-4 w-4" />
                  {isOpen && <span className="ml-3">{item.label}</span>}
                </Link>
              </Button>
            ))}
          </div>

          {location.pathname === '/notes' && uniqueSubjects.length > 0 && (
            <div className="border-t mt-2">
              <div className="p-4">
                {isOpen && <h3 className="text-sm font-medium mb-2">Subjects</h3>}
                <div className="space-y-1">
                  {uniqueSubjects.map((subject) => (
                    <Button
                      key={subject}
                      variant={currentSubject === subject ? "secondary" : "ghost"}
                      size="sm"
                      className={cn(
                        "w-full flex items-center",
                        isOpen ? "justify-start px-3" : "justify-center px-0",
                        currentSubject === subject && "bg-accent/60"
                      )}
                      onClick={() => handleSubjectClick(subject)}
                    >
                      <Tag className="h-4 w-4" />
                      {isOpen && <span className="ml-3 truncate">{subject}</span>}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="p-2 mt-auto">
            <Button
              variant="ghost"
              className={cn(
                "w-full flex items-center",
                isOpen ? "justify-start px-3" : "justify-center px-0",
                "text-destructive hover:text-destructive"
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {isOpen && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
