
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, FileText, BookOpen, Users, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

export function NotesSidebar() {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

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
    <Sidebar
      className={cn(
        "border-r bg-background transition-all duration-300 fixed top-16 h-[calc(100vh-4rem)]",
        collapsed || isMobile ? "w-[50px]" : "w-[250px]"
      )}
    >
      <SidebarHeader className="p-4 flex justify-between items-center">
        <h2 className={cn("font-semibold", (collapsed || isMobile) && "hidden")}>Navigation</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("h-6 w-6", isMobile && "hidden")}
        >
          <ChevronRight className={cn(
            "h-4 w-4 transition-transform",
            !collapsed && "rotate-180"
          )} />
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <div className="space-y-1 p-2">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                (collapsed || isMobile) && "justify-center px-2"
              )}
              asChild
            >
              <Link to={item.path}>
                <item.icon className="h-4 w-4 mr-2" />
                {!collapsed && !isMobile && item.label}
              </Link>
            </Button>
          ))}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-destructive hover:text-destructive",
              (collapsed || isMobile) && "justify-center px-2"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {!collapsed && !isMobile && "Logout"}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
