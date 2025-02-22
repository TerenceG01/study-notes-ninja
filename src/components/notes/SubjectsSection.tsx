
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tag, Trash2 } from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";

interface SubjectsSectionProps {
  isOpen: boolean;
  subjects: string[];
  draggedSubject: string | null;
  dragOverSubject: string | null;
  isDragging: boolean;
  onSubjectClick: (subject: string) => void;
  onDragStart: (subject: string) => void;
  onDragEnter: (subject: string) => void;
  onDragEnd: () => void;
  onRemoveSubject: (subject: string) => void;
}

export function SubjectsSection({
  isOpen,
  subjects,
  draggedSubject,
  dragOverSubject,
  isDragging,
  onSubjectClick,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onRemoveSubject,
}: SubjectsSectionProps) {
  const [searchParams] = useSearchParams();
  const currentSubject = searchParams.get("subject");

  if (subjects.length === 0) return null;

  return (
    <div className="border-t mt-2">
      <div className="p-2">
        {isOpen && <h3 className="text-sm font-medium mb-2 px-2">Subjects</h3>}
        <div className="space-y-1">
          {subjects.map((subject) => (
            <div key={subject} className="group flex items-center justify-between pr-1">
              <Button
                data-subject={subject}
                variant={currentSubject === subject ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "flex-1 flex items-center relative min-w-0",
                  isOpen ? "justify-start px-2" : "justify-center px-0",
                  currentSubject === subject && "bg-accent/60",
                  dragOverSubject === subject && "border-2 border-primary",
                  draggedSubject === subject && "opacity-50",
                  isDragging && "transition-transform duration-150"
                )}
                onClick={() => onSubjectClick(subject)}
                draggable
                onDragStart={() => onDragStart(subject)}
                onDragEnter={() => onDragEnter(subject)}
                onDragEnd={onDragEnd}
                onDragOver={(e) => e.preventDefault()}
              >
                <Tag 
                  className={cn(
                    "h-4 w-4 cursor-grab select-none shrink-0",
                    isDragging && "cursor-grabbing"
                  )}
                />
                {isOpen && <span className="ml-2 truncate">{subject}</span>}
              </Button>
              {isOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-6 w-6 p-0 opacity-0 group-hover:opacity-70 transition-opacity shrink-0",
                    "hover:bg-destructive/10 hover:text-destructive hover:opacity-100",
                    "focus-visible:opacity-100"
                  )}
                  onClick={() => onRemoveSubject(subject)}
                >
                  <Trash2 className="h-3 w-3" />
                  <span className="sr-only">Remove subject</span>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
