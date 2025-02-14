
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, BookOpen, Users, User, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function NotesSidebar() {
  const location = useLocation();
  const { toast } = useToast();
  const { state, toggle } = useSidebar();
  const isOpen = state === "expanded";

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

  const navigationItems = [
    { label: "My Notes", icon: FileText, path: "/notes" },
    { label: "My Flashcards", icon: BookOpen, path: "/flashcards" },
    { label: "Study Groups", icon: Users, path: "/study-groups" },
    { label: "My Profile", icon: User, path: "/profile" },
  ];

  return (
    <Sidebar className={cn(
      "border-r bg-background transition-all duration-300 h-full flex flex-col relative",
      isOpen ? "w-64" : "w-16"
    )}>
      <SidebarHeader className="p-4">
        {isOpen && <h2 className="font-semibold">Navigation</h2>}
      </SidebarHeader>
      <SidebarContent>
        <div className="space-y-1 p-2 flex flex-col items-center">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              className={cn(
                "flex",
                isOpen ? "w-full justify-start" : "w-12 h-12 p-0"
              )}
              asChild
            >
              <Link to={item.path} className="flex items-center">
                <item.icon className={cn(
                  "h-4 w-4",
                  !isOpen && "mx-auto"
                )} />
                {isOpen && <span className="ml-2">{item.label}</span>}
              </Link>
            </Button>
          ))}
          <Button
            variant="ghost"
            className={cn(
              "flex text-destructive hover:text-destructive",
              isOpen ? "w-full justify-start" : "w-12 h-12 p-0"
            )}
            onClick={handleLogout}
          >
            <LogOut className={cn(
              "h-4 w-4",
              !isOpen && "mx-auto"
            )} />
            {isOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </SidebarContent>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-6 rounded-full bg-background border shadow-sm"
        onClick={toggle}
      >
        {isOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    </Sidebar>
  );
}
