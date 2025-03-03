
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Quote,
  Strikethrough,
  Link
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TextFormattingToolbarProps {
  onFormatText: (format: string, value?: string) => void;
}

export const TextFormattingToolbar: React.FC<TextFormattingToolbarProps> = ({
  onFormatText
}) => {
  const formatButtons = [
    { icon: <Bold size={16} />, format: 'bold', tooltip: 'Bold (Ctrl+B)' },
    { icon: <Italic size={16} />, format: 'italic', tooltip: 'Italic (Ctrl+I)' },
    { icon: <Underline size={16} />, format: 'underline', tooltip: 'Underline (Ctrl+U)' },
    { icon: <Strikethrough size={16} />, format: 'strikethrough', tooltip: 'Strikethrough' },
    { type: 'separator' },
    { icon: <Heading1 size={16} />, format: 'h1', tooltip: 'Heading 1' },
    { icon: <Heading2 size={16} />, format: 'h2', tooltip: 'Heading 2' },
    { icon: <Heading3 size={16} />, format: 'h3', tooltip: 'Heading 3' },
    { type: 'separator' },
    { icon: <AlignLeft size={16} />, format: 'justifyLeft', tooltip: 'Align Left' },
    { icon: <AlignCenter size={16} />, format: 'justifyCenter', tooltip: 'Align Center' },
    { icon: <AlignRight size={16} />, format: 'justifyRight', tooltip: 'Align Right' },
    { type: 'separator' },
    { icon: <List size={16} />, format: 'insertUnorderedList', tooltip: 'Bullet List' },
    { icon: <ListOrdered size={16} />, format: 'insertOrderedList', tooltip: 'Numbered List' },
    { type: 'separator' },
    { icon: <Link size={16} />, format: 'createLink', tooltip: 'Insert Link' },
    { icon: <Quote size={16} />, format: 'formatBlock', value: 'blockquote', tooltip: 'Quote' },
    { icon: <Code size={16} />, format: 'formatCode', tooltip: 'Code Block' }
  ];

  return (
    <TooltipProvider>
      <div className="bg-muted/40 border-b p-1 flex flex-wrap gap-0.5 rounded-t-lg">
        {formatButtons.map((button, index) => (
          button.type === 'separator' ? (
            <div key={`sep-${index}`} className="h-8 w-px bg-border mx-1" />
          ) : (
            <Tooltip key={button.format}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 rounded-sm"
                  onClick={() => onFormatText(button.format, button.value)}
                >
                  {button.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{button.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )
        ))}
      </div>
    </TooltipProvider>
  );
};
