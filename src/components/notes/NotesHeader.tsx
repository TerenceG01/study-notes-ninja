import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
interface NotesHeaderProps {
  onSearch: (query: string) => void;
}
export const NotesHeader = ({
  onSearch
}: NotesHeaderProps) => {
  return <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-primary bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent px-[16px]">
          My Notes
        </h1>
        <p className="text-muted-foreground px-[16px]">
          Organize and manage your study materials
        </p>
      </div>
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search notes..." className="pl-10" onChange={e => onSearch(e.target.value)} />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>;
};