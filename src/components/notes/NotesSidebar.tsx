
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
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useState } from "react";

export function NotesSidebar() {
  const location = useLocation();
  const { toast } = useToast();
  const { state } = useSidebar();
  const isOpen = state === "expanded";
  const isMobile = useIsMobile();
  const [sidebarWidth, setSidebarWidth] = useState(20); // 20% of container width

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

  const onResize = (sizes: number[]) => {
    setSidebarWidth(sizes[0]);
  };

  return (
    <PanelGroup direction="horizontal" onLayout={onResize}>
      <Panel 
        defaultSize={20} 
        minSize={15} 
        maxSize={30}
        className="h-full"
      >
        <Sidebar className="border-r bg-background/80 backdrop-blur-sm h-full flex flex-col w-full">
          <SidebarHeader className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold">Navigation</h2>
          </SidebarHeader>
          <SidebarContent className="flex-1">
            <div className="space-y-2 p-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? "secondary" : "ghost"}
                  className={cn(
                    "w-full flex items-center gap-3 justify-start px-3",
                    location.pathname === item.path && "bg-secondary"
                  )}
                  asChild
                >
                  <Link to={item.path}>
                    <div className="w-4 h-4 shrink-0">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </Link>
                </Button>
              ))}

              <Button
                variant="ghost"
                className="w-full flex items-center gap-3 justify-start px-3 text-destructive hover:text-destructive"
                onClick={handleLogout}
              >
                <div className="w-4 h-4 shrink-0">
                  <LogOut className="h-4 w-4" />
                </div>
                <span className="truncate">Logout</span>
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>
      </Panel>
      <PanelResizeHandle className="w-2 bg-transparent hover:bg-accent/10 cursor-col-resize transition-colors" />
    </PanelGroup>
  );
}
