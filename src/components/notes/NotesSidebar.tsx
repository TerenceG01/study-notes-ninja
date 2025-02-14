
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface NotesSidebarProps {
  subjects: string[];
  selectedSubject: string | null;
  onSubjectSelect: (subject: string) => void;
}

export function NotesSidebar({ subjects, selectedSubject, onSubjectSelect }: NotesSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sidebar
      className={cn(
        "border-r bg-background transition-all duration-300",
        collapsed ? "w-[50px]" : "w-[250px]"
      )}
    >
      <SidebarHeader className="p-4 flex justify-between items-center">
        <h2 className={cn("font-semibold", collapsed && "hidden")}>Subjects</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-6 w-6"
        >
          <ChevronRight className={cn(
            "h-4 w-4 transition-transform",
            !collapsed && "rotate-180"
          )} />
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <div className="space-y-1 p-2">
          {subjects.map((subject) => (
            <Button
              key={subject}
              variant={selectedSubject === subject ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                collapsed && "justify-center px-2"
              )}
              onClick={() => onSubjectSelect(subject)}
            >
              {!collapsed ? subject : subject[0]}
            </Button>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
