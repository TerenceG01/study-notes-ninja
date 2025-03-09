
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onCtrlEnter?: () => void;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onCtrlEnter, ...props }, ref) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Add keyboard shortcut for Ctrl+S to save
      if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        // Find closest form and submit it or use the save callback
        const form = event.currentTarget.closest('form');
        if (form) {
          form.requestSubmit();
        }
      }
      
      // Support Ctrl+Enter callback if provided
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && onCtrlEnter) {
        event.preventDefault();
        onCtrlEnter();
      }
    };

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 break-words overflow-hidden",
          className
        )}
        ref={ref}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
