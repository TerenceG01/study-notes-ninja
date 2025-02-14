
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
      "border-r bg-background transition-all duration-300 h-full flex flex-col",
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
                "flex w-full",
                isOpen ? "justify-start" : "justify-center"
              )}
              asChild
            >
              <Link to={item.path} className="flex items-center">
                <item.icon className={cn(
                  "h-6 w-6 stroke-[1.5]",
                  location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                )} />
                {isOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            </Button>
          ))}
          <Button
            variant="ghost"
            className={cn(
              "flex w-full text-destructive hover:text-destructive",
              isOpen ? "justify-start" : "justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-6 w-6 stroke-[1.5]" />
            {isOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
