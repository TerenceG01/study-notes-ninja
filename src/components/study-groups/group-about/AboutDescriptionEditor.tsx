
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface AboutDescriptionEditorProps {
  description: string;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
  isLoading: boolean;
}

export const AboutDescriptionEditor = ({ 
  description, 
  onSave, 
  onCancel, 
  onChange,
  isLoading 
}: AboutDescriptionEditorProps) => {
  return (
    <div className="space-y-2">
      <Textarea 
        value={description} 
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add a description for your study group..."
        className="min-h-[120px] resize-y"
      />
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancel}
          disabled={isLoading}
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button 
          size="sm" 
          onClick={onSave}
          disabled={isLoading}
        >
          {isLoading ? (
            "Saving..."
          ) : (
            <>
              <Save className="h-4 w-4 mr-1" />
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
