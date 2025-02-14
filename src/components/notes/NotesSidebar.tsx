
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
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

export function NotesSidebar() {
  const location = useLocation();
  const { toast } = useToast();
  const { state, toggleSidebar } = useSidebar();
  const isOpen = state === "expanded";
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);

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
    <Sidebar 
      className={cn(
        "border-r bg-background/80 backdrop-blur-sm transition-all duration-300 h-full flex flex-col relative",
        isOpen ? "w-64" : "w-16 hover:w-64",
        isMobile && "fixed inset-y-0 left-0 z-50"
      )}
      onMouseEnter={() => !isOpen && setIsHovered(true)}
      onMouseLeave={() => !isOpen && setIsHovered(false)}
    >
      <SidebarHeader className="p-4 border-b">
        {(isOpen || isHovered) && <h2 className="font-semibold">Navigation</h2>}
      </SidebarHeader>
      <SidebarContent>
        <div className="space-y-1 p-2">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              className={cn(
                "w-full flex items-center gap-2 group relative",
                (isOpen || isHovered) ? "justify-start" : "justify-center",
                location.pathname === item.path && "bg-secondary"
              )}
              asChild
            >
              <Link to={item.path}>
                <item.icon className={cn(
                  "h-4 w-4 shrink-0",
                  !(isOpen || isHovered) && "mx-auto"
                )} />
                {(isOpen || isHovered) && (
                  <span className={cn(
                    "transition-all duration-200",
                    !isOpen && "opacity-0 group-hover:opacity-100"
                  )}>
                    {item.label}
                  </span>
                )}
              </Link>
            </Button>
          ))}

          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center gap-2 group relative text-destructive hover:text-destructive",
              (isOpen || isHovered) ? "justify-start" : "justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut className={cn(
              "h-4 w-4 shrink-0",
              !(isOpen || isHovered) && "mx-auto"
            )} />
            {(isOpen || isHovered) && (
              <span className={cn(
                "transition-all duration-200",
                !isOpen && "opacity-0 group-hover:opacity-100"
              )}>
                Logout
              </span>
            )}
          </Button>
        </div>
      </SidebarContent>
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-6 rounded-full bg-background border shadow-sm"
          onClick={toggleSidebar}
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      )}
    </Sidebar>
  );
}
