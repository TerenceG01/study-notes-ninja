
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import type { Note } from "@/components/notes/types";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
  isShared: boolean;
  isPending: boolean;
  onShareToggle: (noteId: string, isShared: boolean) => void;
  isMultiSelect?: boolean;
  isSelected?: boolean;
  onSelectToggle?: (noteId: string, isSelected: boolean) => void;
  isMobile?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  isShared,
  isPending,
  onShareToggle,
  isMultiSelect = false,
  isSelected = false,
  onSelectToggle,
  isMobile = false
}) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPending) {
      onShareToggle(note.id, !isShared);
    }
  };

  const handleSelectToggle = () => {
    if (onSelectToggle && isMultiSelect) {
      onSelectToggle(note.id, !isSelected);
    }
  };

  const truncateText = (text: string, length: number) => {
    if (!text) return "Untitled";
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  return (
    <Card 
      className={cn(
        "border transition-all duration-200 hover:shadow-md",
        isMultiSelect && "cursor-pointer",
        isMultiSelect && isSelected && "border-primary bg-primary/5",
        isMobile ? "p-0" : ""
      )}
      onClick={isMultiSelect ? handleSelectToggle : undefined}
    >
      <CardContent className={cn(
        "flex items-center justify-between",
        isMobile ? "p-3" : "p-4"
      )}>
        <div className={`flex ${isMultiSelect ? 'space-x-2' : ''} items-center flex-1 min-w-0`}>
          {isMultiSelect && (
            <Checkbox 
              checked={isSelected} 
              onCheckedChange={() => onSelectToggle?.(note.id, !isSelected)}
              className={isMobile ? "h-3 w-3" : ""}
              onClick={(e) => e.stopPropagation()}
            />
          )}

          <div className="flex-1 min-w-0">
            <h3 className={`font-medium ${isMobile ? 'text-sm' : 'text-base'} truncate`}>
              {isMobile ? truncateText(note.title || 'Untitled', 25) : (note.title || 'Untitled')}
            </h3>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'} truncate`}>
              {isMobile ? truncateText(note.subject || 'No subject', 20) : (note.subject || 'No subject')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-2">
          {!isMultiSelect && (
            <>
              {isPending ? (
                <Loader2 className={`animate-spin ${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-muted-foreground`} />
              ) : isShared ? (
                <CheckCircle className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-green-500`} />
              ) : (
                <XCircle className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-gray-300`} />
              )}
              <Switch 
                checked={isShared}
                onCheckedChange={() => onShareToggle(note.id, !isShared)}
                disabled={isPending}
                className={isMobile ? "h-4 w-7" : ""}
                onClick={handleToggle}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
