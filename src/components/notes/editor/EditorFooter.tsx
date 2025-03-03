
import { FileText } from "lucide-react";

interface EditorFooterProps {
  wordCount: number;
}

export const EditorFooter = ({ wordCount }: EditorFooterProps) => {
  return (
    <div className="flex justify-between text-xs text-muted-foreground pt-3 px-4 pb-2">
      <div className="flex items-center gap-1">
        <FileText className="h-3 w-3" />
        <span>{wordCount} words</span>
      </div>
      <div className="italic">
        Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Ctrl+S</kbd> to save
      </div>
    </div>
  );
};
