
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter, Palette, X, BookOpen, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommonSubjects } from "../CommonSubjects";
import { Badge } from "@/components/ui/badge";

// Base color definitions for reference
const SUBJECT_COLORS = [
  { name: 'Blue', value: 'blue', class: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
  { name: 'Green', value: 'green', class: 'bg-green-50 text-green-600 hover:bg-green-100' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
  { name: 'Red', value: 'red', class: 'bg-red-50 text-red-600 hover:bg-red-100' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
];

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
    <>
      <div className="flex items-center gap-2">
        {/* Subject Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-2",
                selectedSubject && "border-primary"
              )}
            >
              <Tag className="h-4 w-4" />
              {selectedSubject ? 
                <span className="max-w-[100px] truncate">{selectedSubject}</span> : 
                <span>Subject</span>
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-2">
            <div className="max-h-64 overflow-y-auto space-y-1">
              {uniqueSubjects.length > 0 ? (
                uniqueSubjects.map(subject => (
                  <Button
                    key={subject}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left",
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
                "flex items-center gap-2",
                selectedColor && "border-primary"
              )}
              disabled={availableColors.length === 0}
            >
              <Palette className="h-4 w-4" />
              Color {availableColors.length === 0 && "(None)"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <div className="grid grid-cols-2 gap-1">
              {availableColors.map(color => (
                <Button
                  key={color.value}
                  variant="ghost"
                  className={cn(
                    "justify-start",
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
                "flex items-center gap-2",
                selectedDate && "border-primary"
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {selectedDate ? format(selectedDate, 'PP') : 'Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
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
            className="text-muted-foreground hover:text-primary"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {(selectedColor || selectedSubject || selectedDate) && (
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filtering by:</span>
          {selectedColor && (
            <span className={cn(
              "px-2 py-1 rounded-md",
              SUBJECT_COLORS.find(c => c.value === selectedColor)?.class
            )}>
              {SUBJECT_COLORS.find(c => c.value === selectedColor)?.name}
            </span>
          )}
          {selectedSubject && (
            <Badge variant="secondary">
              {selectedSubject}
            </Badge>
          )}
          {selectedDate && (
            <span className="px-2 py-1 bg-secondary rounded-md">
              {format(selectedDate, 'PP')}
            </span>
          )}
        </div>
      )}
    </>
  );
};
