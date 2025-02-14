
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

export function NotesSidebar() {
  const location = useLocation();
  const { toast } = useToast();
  const { state } = useSidebar();
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
      "border-r bg-background transition-all duration-300 h-full",
      isOpen ? "w-64" : "w-16"
    )}>
      <SidebarHeader className="p-4">
        {isOpen && <h2 className="font-semibold">Navigation</h2>}
      </SidebarHeader>
      <SidebarContent>
        <div className="space-y-2 p-2">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              asChild
              className={cn(
                "relative min-w-0 w-full",
                !isOpen && "h-10 px-0"
              )}
            >
              <Link 
                to={item.path}
                className={cn(
                  "flex items-center w-full",
                  isOpen ? "justify-start px-3" : "justify-center"
                )}
              >
                <div className="flex-shrink-0">
                  <item.icon className="h-5 w-5" />
                </div>
                {isOpen && (
                  <span className="ml-3 truncate">{item.label}</span>
                )}
              </Link>
            </Button>
          ))}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "relative min-w-0 w-full text-destructive hover:text-destructive",
              !isOpen && "h-10 px-0"
            )}
          >
            <div className={cn(
              "flex items-center w-full",
              isOpen ? "justify-start px-3" : "justify-center"
            )}>
              <div className="flex-shrink-0">
                <LogOut className="h-5 w-5" />
              </div>
              {isOpen && (
                <span className="ml-3 truncate">Logout</span>
              )}
            </div>
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
