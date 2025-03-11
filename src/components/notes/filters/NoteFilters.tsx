import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter, Palette, X, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommonSubjects } from "../CommonSubjects";
import { Badge } from "@/components/ui/badge";
import { SUBJECT_COLORS } from "../table/constants/colors";

interface NoteFiltersProps {
  selectedColor: string | null;
  selectedSubject: string | null;
  selectedDate: Date | null;
  uniqueSubjects: string[];
  uniqueColors: string[];
  onColorChange: (color: string) => void;
  onSubjectChange: (subject: string) => void;
  onDateChange: (date: Date | null) => void;
  onClearFilters: () => void;
}

export const NoteFilters = ({
  selectedColor,
  selectedSubject,
  selectedDate,
  uniqueSubjects,
  uniqueColors,
  onColorChange,
  onSubjectChange,
  onDateChange,
  onClearFilters,
}: NoteFiltersProps) => {
  // Get only the color definitions for colors that are actually in use
  const availableColors = SUBJECT_COLORS.filter(color => 
    uniqueColors.includes(color.value)
  );

  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className="flex flex-wrap items-center gap-2">
        {/* Subject Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-1.5 h-8",
                selectedSubject && "border-primary"
              )}
            >
              <Tag className="h-3.5 w-3.5" />
              <span className="truncate max-w-[80px]">
                {selectedSubject ? selectedSubject : "Subject"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-2" align="start">
            <div className="max-h-[240px] overflow-y-auto space-y-1">
              {uniqueSubjects.length > 0 ? (
                uniqueSubjects.map(subject => (
                  <Button
                    key={subject}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left text-sm h-8",
                      selectedSubject === subject && "bg-muted font-medium"
                    )}
                    onClick={() => onSubjectChange(subject)}
                  >
                    {subject}
                  </Button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-2">No subjects found</p>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Color Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-1.5 h-8",
                selectedColor && "border-primary"
              )}
              disabled={availableColors.length === 0}
            >
              <Palette className="h-3.5 w-3.5" />
              <span className="truncate max-w-[80px]">
                {selectedColor 
                  ? SUBJECT_COLORS.find(c => c.value === selectedColor)?.name 
                  : "Color"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="start">
            <div className="grid grid-cols-2 gap-1">
              {availableColors.map(color => (
                <Button
                  key={color.value}
                  variant="ghost"
                  className={cn(
                    "justify-start h-8 text-sm",
                    color.class,
                    selectedColor === color.value && "border-2 border-primary"
                  )}
                  onClick={() => onColorChange(color.value)}
                >
                  {color.name}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Date Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-1.5 h-8",
                selectedDate && "border-primary"
              )}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span className="truncate max-w-[80px]">
                {selectedDate ? format(selectedDate, 'MM/dd') : 'Date'}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {(selectedColor || selectedSubject || selectedDate) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-primary h-8"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            <span>Clear</span>
          </Button>
        )}
      </div>

      {/* Active Filters Display - Mobile friendly condensed view */}
      {(selectedColor || selectedSubject || selectedDate) && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
          <span className="flex items-center">
            <Filter className="h-3.5 w-3.5 mr-1" />
            Filters:
          </span>
          {selectedColor && (
            <Badge variant="outline" className={cn(
              "px-2 py-0.5 text-xs",
              SUBJECT_COLORS.find(c => c.value === selectedColor)?.class
            )}>
              {SUBJECT_COLORS.find(c => c.value === selectedColor)?.name}
            </Badge>
          )}
          {selectedSubject && (
            <Badge variant="secondary" className="px-2 py-0.5 text-xs">
              {selectedSubject}
            </Badge>
          )}
          {selectedDate && (
            <Badge variant="outline" className="px-2 py-0.5 text-xs bg-secondary">
              {format(selectedDate, 'MM/dd/yyyy')}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
