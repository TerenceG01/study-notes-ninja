
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, BookOpen, Users, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

export function NotesSidebar() {
  const location = useLocation();
  const { toast } = useToast();
  const { state } = useSidebar();
  const isOpen = state === "expanded";
  const isMobile = useIsMobile();

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

  if (isMobile && !isOpen) {
    return null;
  }

  return (
    <Sidebar className={cn(
      "border-r bg-background/80 backdrop-blur-sm h-full transition-all duration-300",
      isOpen ? "w-48" : "w-16"
    )}>
      <SidebarHeader className="p-4 border-b">
        {isOpen && <h2 className="font-semibold">Navigation</h2>}
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <div className="space-y-2 p-2">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              className={cn(
                "w-full flex items-center gap-3",
                isOpen ? "justify-start px-3" : "justify-center",
                location.pathname === item.path && "bg-secondary"
              )}
              asChild
            >
              <Link to={item.path}>
                <item.icon className="h-4 w-4 shrink-0" />
                {isOpen && <span className="truncate">{item.label}</span>}
              </Link>
            </Button>
          ))}

          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center gap-3 text-destructive hover:text-destructive",
              isOpen ? "justify-start px-3" : "justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {isOpen && <span className="truncate">Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
