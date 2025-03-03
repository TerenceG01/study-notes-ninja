
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Heading1, 
  Heading2,
  Code,
  Quote,
  Text
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface TextFormattingToolbarProps {
  onFormatText: (formatType: string) => void;
}

export const TextFormattingToolbar = ({ 
  onFormatText 
}: TextFormattingToolbarProps) => {
  // Format buttons configuration
  const textControls = [
    { id: 'bold', icon: <Bold className="h-4 w-4" />, title: 'Bold' },
    { id: 'italic', icon: <Italic className="h-4 w-4" />, title: 'Italic' },
    { id: 'underline', icon: <Underline className="h-4 w-4" />, title: 'Underline' },
    { id: 'strikethrough', icon: <Strikethrough className="h-4 w-4" />, title: 'Strikethrough' }
  ];

  const listControls = [
    { id: 'bullet', icon: <List className="h-4 w-4" />, title: 'Bullet List' },
    { id: 'numbered', icon: <ListOrdered className="h-4 w-4" />, title: 'Numbered List' }
  ];

  const alignControls = [
    { id: 'left', icon: <AlignLeft className="h-4 w-4" />, title: 'Align Left' },
    { id: 'center', icon: <AlignCenter className="h-4 w-4" />, title: 'Align Center' },
    { id: 'right', icon: <AlignRight className="h-4 w-4" />, title: 'Align Right' }
  ];

  const headingControls = [
    { id: 'h1', icon: <Heading1 className="h-4 w-4" />, title: 'Heading 1' },
    { id: 'h2', icon: <Heading2 className="h-4 w-4" />, title: 'Heading 2' }
  ];

  const otherControls = [
    { id: 'code', icon: <Code className="h-4 w-4" />, title: 'Code Block' },
    { id: 'quote', icon: <Quote className="h-4 w-4" />, title: 'Quote' }
  ];

  return (
    <div className="bg-muted/40 p-2 rounded-t-lg border-b border-border flex flex-wrap gap-1 items-center justify-between">
      <div className="flex flex-wrap gap-1 items-center">
        <div className="flex gap-1 items-center">
          {textControls.map((control) => (
            <Button
              key={control.id}
              variant="ghost"
              size="sm"
              onClick={() => onFormatText(control.id)}
              title={control.title}
              className="h-8 px-2 hover:bg-muted"
            >
              {control.icon}
            </Button>
          ))}
        </div>
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        <ToggleGroup type="single" className="flex gap-1">
          {alignControls.map((control) => (
            <ToggleGroupItem
              key={control.id}
              value={control.id}
              variant="outline"
              size="sm"
              onClick={() => onFormatText(`align-${control.id}`)}
              title={control.title}
              className="h-8 px-2 data-[state=on]:bg-muted"
            >
              {control.icon}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <Separator orientation="vertical" className="h-6 mx-1" />
        
        <div className="flex gap-1 items-center">
          {headingControls.map((control) => (
            <Button
              key={control.id}
              variant="ghost"
              size="sm"
              onClick={() => onFormatText(control.id)}
              title={control.title}
              className="h-8 px-2 hover:bg-muted"
            >
              {control.icon}
            </Button>
          ))}
        </div>
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        <div className="flex gap-1 items-center">
          {listControls.map((control) => (
            <Button
              key={control.id}
              variant="ghost"
              size="sm"
              onClick={() => onFormatText(`list-${control.id}`)}
              title={control.title}
              className="h-8 px-2 hover:bg-muted"
            >
              {control.icon}
            </Button>
          ))}
        </div>
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        <div className="flex gap-1 items-center">
          {otherControls.map((control) => (
            <Button
              key={control.id}
              variant="ghost"
              size="sm"
              onClick={() => onFormatText(control.id)}
              title={control.title}
              className="h-8 px-2 hover:bg-muted"
            >
              {control.icon}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center">
        <Text className="h-4 w-4 mr-1 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Rich Text Editor</span>
      </div>
    </div>
  );
};
