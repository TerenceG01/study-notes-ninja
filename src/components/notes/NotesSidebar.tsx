
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut, Tag, MoreVertical, ChevronUp, ChevronDown, Share, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { navigationItems } from "@/components/navigation/NavigationItems";
import { useSearchParams } from "react-router-dom";
import { useNotes } from "@/hooks/useNotes";
import { useMemo, useState } from "react";

const SUBJECT_COLORS = [
  { name: 'Blue', value: 'blue', class: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
  { name: 'Green', value: 'green', class: 'bg-green-50 text-green-600 hover:bg-green-100' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
  { name: 'Red', value: 'red', class: 'bg-red-50 text-red-600 hover:bg-red-100' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
];

export function NotesSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state } = useSidebar();
  const isOpen = state === "expanded";
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSubject = searchParams.get("subject");
  const { notes } = useNotes();
  const [subjectOrder, setSubjectOrder] = useState<string[]>([]);

  const uniqueSubjects = useMemo(() => {
    const subjects = Array.from(new Set(notes.map(note => note.subject || "General")))
      .filter(Boolean)
      .sort();
    
    // Initialize subjectOrder if empty
    if (subjectOrder.length === 0 && subjects.length > 0) {
      setSubjectOrder(subjects);
    }
    
    // Return subjects in custom order if available
    return subjectOrder.length > 0 ? subjectOrder : subjects;
  }, [notes, subjectOrder]);

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
      if (currentSubject === subject) {
        searchParams.delete("subject");
      } else {
        searchParams.set("subject", subject);
      }
      setSearchParams(searchParams);
    } else {
      navigate(`/notes?subject=${subject}`);
    }
  };

  const handleColorChange = async (subject: string, color: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          subject_color: color,
        } as any) // Using type assertion temporarily to fix build
        .eq('subject', subject);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Updated color for ${subject}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update subject color",
      });
    }
  };

  const moveSubject = (subject: string, direction: 'up' | 'down') => {
    const currentIndex = subjectOrder.indexOf(subject);
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < subjectOrder.length - 1)
    ) {
      const newOrder = [...subjectOrder];
      const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      [newOrder[currentIndex], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[currentIndex]];
      setSubjectOrder(newOrder);
      
      toast({
        title: "Success",
        description: `Moved ${subject} ${direction}`,
      });
    }
  };

  const handleShareSubject = async (subject: string) => {
    try {
      const notesWithSubject = notes.filter(note => note.subject === subject);
      
      // Create a study group with this subject
      const { data: group, error: groupError } = await supabase
        .rpc('create_study_group', {
          p_name: `${subject} Study Group`,
          p_subject: subject,
          p_description: `Study group for ${subject}`,
          p_user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (groupError) throw groupError;

      // Share all notes with this subject to the group
      for (const note of notesWithSubject) {
        await supabase
          .from('study_group_notes')
          .insert({
            note_id: note.id,
            group_id: group.id,
            shared_by: (await supabase.auth.getUser()).data.user?.id
          });
      }

      toast({
        title: "Success",
        description: `Created study group for ${subject} and shared ${notesWithSubject.length} notes`,
      });

      // Navigate to the new study group
      navigate(`/study-groups/${group.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to share subject",
      });
    }
  };

  const handleRemoveSubject = async (subject: string) => {
    try {
      // Set subject to null for all notes with this subject
      const { error } = await supabase
        .from('notes')
        .update({ subject: null })
        .eq('subject', subject);

      if (error) throw error;

      // Remove from subject order
      setSubjectOrder(current => current.filter(s => s !== subject));

      // Clear subject from URL if it was selected
      if (currentSubject === subject) {
        searchParams.delete("subject");
        setSearchParams(searchParams);
      }

      toast({
        title: "Success",
        description: `Removed subject ${subject}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove subject",
      });
    }
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

          {uniqueSubjects.length > 0 && (
            <div className="border-t mt-2">
              <div className="p-4">
                {isOpen && <h3 className="text-sm font-medium mb-2">Subjects</h3>}
                <div className="space-y-1">
                  {uniqueSubjects.map((subject) => (
                    <div key={subject} className="flex items-center gap-1">
                      <Button
                        variant={currentSubject === subject ? "secondary" : "ghost"}
                        size="sm"
                        className={cn(
                          "flex-1 flex items-center",
                          isOpen ? "justify-start px-3" : "justify-center px-0",
                          currentSubject === subject && "bg-accent/60"
                        )}
                        onClick={() => handleSubjectClick(subject)}
                      >
                        <Tag className="h-4 w-4" />
                        {isOpen && <span className="ml-3 truncate">{subject}</span>}
                      </Button>
                      {isOpen && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                              Subject Color
                            </div>
                            <div className="grid grid-cols-5 gap-1 p-2">
                              {SUBJECT_COLORS.map((color) => (
                                <Button
                                  key={color.value}
                                  variant="ghost"
                                  size="sm"
                                  className={cn(
                                    "h-6 w-6 p-0 rounded-full",
                                    color.class
                                  )}
                                  onClick={() => handleColorChange(subject, color.value)}
                                />
                              ))}
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="gap-2"
                              onClick={() => moveSubject(subject, 'up')}
                            >
                              <ChevronUp className="h-4 w-4" />
                              Move Up
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="gap-2"
                              onClick={() => moveSubject(subject, 'down')}
                            >
                              <ChevronDown className="h-4 w-4" />
                              Move Down
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="gap-2"
                              onClick={() => handleShareSubject(subject)}
                            >
                              <Share className="h-4 w-4" />
                              Share Subject
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="gap-2 text-destructive"
                              onClick={() => handleRemoveSubject(subject)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove Subject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
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
