
import * as React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSubjects } from "@/hooks/useSubjects";
import { NavigationSection } from "./NavigationSection";
import { SubjectsSection } from "./SubjectsSection";

export function NotesSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state } = useSidebar();
  const isOpen = state === "expanded";
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    uniqueSubjects,
    draggedSubject,
    setDraggedSubject,
    dragOverSubject,
    setDragOverSubject,
    isDragging,
    setIsDragging,
    handleMoveSubject,
    handleRemoveSubject
  } = useSubjects();

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
    const isNotesPage = location.pathname === '/notes';
    
    if (isNotesPage) {
      if (searchParams.get("subject") === subject) {
        searchParams.delete("subject");
      } else {
        searchParams.set("subject", subject);
      }
      setSearchParams(searchParams);
    } else {
      navigate(`/notes?subject=${subject}`);
    }
  };

  const handleDragStart = (subject: string) => {
    setDraggedSubject(subject);
    setIsDragging(true);
  };

  const handleDragEnter = (subject: string) => {
    if (draggedSubject && draggedSubject !== subject) {
      setDragOverSubject(subject);
    }
  };

  const handleDragEnd = async () => {
    if (draggedSubject && dragOverSubject && draggedSubject !== dragOverSubject) {
      await handleMoveSubject(draggedSubject, dragOverSubject);
    }
    setIsDragging(false);
    setDraggedSubject(null);
    setDragOverSubject(null);
  };

  if (isMobile && !isOpen) {
    return null;
  }

  return (
    <>
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
        <SidebarContent 
          className="flex flex-col h-full"
        >
          <NavigationSection isOpen={isOpen} />

          <SubjectsSection
            isOpen={isOpen}
            subjects={uniqueSubjects}
            draggedSubject={draggedSubject}
            dragOverSubject={dragOverSubject}
            isDragging={isDragging}
            onSubjectClick={handleSubjectClick}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragEnd={handleDragEnd}
            onRemoveSubject={handleRemoveSubject}
          />

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
