
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter, Palette, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  uniqueColors: string[]; // New prop for available colors
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
  uniqueColors, // New prop
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

        {/* Subject Filter */}
        <Select value={selectedSubject || ""} onValueChange={onSubjectChange}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            {uniqueSubjects.map(subject => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
            <span className="px-2 py-1 bg-secondary rounded-md">
              {selectedSubject}
            </span>
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
