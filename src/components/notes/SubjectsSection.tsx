
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GripVertical, Tag, Trash2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

interface Subject {
  subject: string;
  order: number;
}

interface SortableSubjectItemProps {
  subject: Subject;
  isOpen: boolean;
  currentSubject: string | null;
  onSubjectClick: (subject: string) => void;
  onRemoveSubject: (subject: string) => void;
}

function SortableSubjectItem({
  subject,
  isOpen,
  currentSubject,
  onSubjectClick,
  onRemoveSubject
}: SortableSubjectItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subject.subject });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center justify-between pr-1",
        isDragging && "z-50"
      )}
    >
      <Button
        variant={currentSubject === subject.subject ? "secondary" : "ghost"}
        size="sm"
        className={cn(
          "flex-1 flex items-center relative min-w-0",
          isOpen ? "justify-start px-2" : "justify-center px-0",
          currentSubject === subject.subject && "bg-accent/60",
          isDragging && "opacity-50"
        )}
        onClick={() => onSubjectClick(subject.subject)}
      >
        <div
          {...attributes}
          {...listeners}
          className={cn(
            "absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing",
            isDragging && "opacity-100"
          )}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <Tag className={cn("h-4 w-4 shrink-0", isOpen && "ml-6")} />
        {isOpen && <span className="ml-2 truncate">{subject.subject}</span>}
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
                  This will permanently delete the subject "{subject.subject}" and ALL notes associated with it. 
                  Are you sure you want to proceed?
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onClick={() => onRemoveSubject(subject.subject)}
              >
                Delete Subject and Notes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

interface SubjectsSectionProps {
  isOpen: boolean;
  subjects: Subject[];
  onSubjectClick: (subject: string) => void;
  onRemoveSubject: (subject: string) => void;
  onReorder: (subjects: Subject[]) => void;
}

export function SubjectsSection({
  isOpen,
  subjects,
  onSubjectClick,
  onRemoveSubject,
  onReorder,
}: SubjectsSectionProps) {
  const [searchParams] = useSearchParams();
  const currentSubject = searchParams.get("subject");
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = subjects.findIndex((s) => s.subject === active.id);
    const newIndex = subjects.findIndex((s) => s.subject === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newSubjects = [...subjects];
    const [removed] = newSubjects.splice(oldIndex, 1);
    newSubjects.splice(newIndex, 0, removed);

    // Update orders
    const updatedSubjects = newSubjects.map((subject, index) => ({
      ...subject,
      order: index,
    }));

    onReorder(updatedSubjects);
  };

  if (subjects.length === 0) return null;

  return (
    <div className="border-t mt-2">
      <div className="p-2">
        {isOpen && <h3 className="text-sm font-medium mb-2 px-2">Subjects</h3>}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={subjects.map(s => s.subject)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {subjects.map((subject) => (
                <SortableSubjectItem
                  key={subject.subject}
                  subject={subject}
                  isOpen={isOpen}
                  currentSubject={currentSubject}
                  onSubjectClick={onSubjectClick}
                  onRemoveSubject={onRemoveSubject}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
