
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface NoteCreationControlsProps {
  onSearch: (query: string) => void;
  onCreateNote: () => void;
}

export const NoteCreationControls = ({ 
  onSearch, 
  onCreateNote 
}: NoteCreationControlsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("searchNotes")} className="pl-10" onChange={e => onSearch(e.target.value)} />
        </div>
        <Button onClick={onCreateNote} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          {t("newNote")}
        </Button>
      </div>
    </div>
  );
};
