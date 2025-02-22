
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tag, Trash2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SubjectsSectionProps {
  isOpen: boolean;
  subjects: string[];
  onSubjectClick: (subject: string) => void;
  onRemoveSubject: (subject: string) => void;
}

export function SubjectsSection({
  isOpen,
  subjects,
  onSubjectClick,
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
                variant={currentSubject === subject ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "flex-1 flex items-center relative min-w-0",
                  isOpen ? "justify-start px-2" : "justify-center px-0",
                  currentSubject === subject && "bg-accent/60"
                )}
                onClick={() => onSubjectClick(subject)}
              >
                <Tag className="h-4 w-4 shrink-0" />
                {isOpen && <span className="ml-2 truncate">{subject}</span>}
              </Button>
              {isOpen && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-6 w-6 p-0 opacity-0 group-hover:opacity-70 transition-opacity shrink-0",
                        "hover:bg-destructive/10 hover:text-destructive hover:opacity-100",
                        "focus-visible:opacity-100"
                      )}
                    >
                      <Trash2 className="h-3 w-3" />
                      <span className="sr-only">Remove subject</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Subject and Notes</AlertDialogTitle>
                      <AlertDialogDescription className="space-y-2">
                        <p className="font-medium text-destructive">Warning: This action cannot be undone.</p>
                        <p>
                          This will permanently delete the subject "{subject}" and ALL notes associated with it. 
                          Are you sure you want to proceed?
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={() => onRemoveSubject(subject)}
                      >
                        Delete Subject and Notes
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
