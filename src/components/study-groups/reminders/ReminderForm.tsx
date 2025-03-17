
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus } from "lucide-react";

interface ReminderFormProps {
  onSubmit: (title: string, date: Date) => void;
}

export function ReminderForm({ onSubmit }: ReminderFormProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && title.trim()) {
      onSubmit(title, date);
      setTitle("");
      setDate(undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-full">
      <div className="w-full">
        <Textarea
          placeholder="Add a new reminder or deadline..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full min-h-[60px] max-h-[100px] resize-y text-sm text-wrap"
        />
      </div>
      <div className="flex items-center gap-2 justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "justify-start text-left font-normal w-20",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-1 h-4 w-4" />
              {date ? format(date, "MMM d") : "Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        <Button 
          type="submit" 
          size="sm" 
          className="shrink-0 w-20"
          disabled={!date || !title.trim()}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
    </form>
  );
}
