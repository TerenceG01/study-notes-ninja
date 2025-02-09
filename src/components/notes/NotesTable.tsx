
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Note } from "@/types/notes";

type NotesTableProps = {
  notes: Note[];
  loading: boolean;
  onNoteSelect: (note: Note) => void;
};

export const NotesTable = ({ notes, loading, onNoteSelect }: NotesTableProps) => {
  return (
    <div className="bg-card rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Folder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : notes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No notes found. Create your first note above!
              </TableCell>
            </TableRow>
          ) : (
            notes.map((note) => (
              <TableRow
                key={note.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onNoteSelect(note)}
              >
                <TableCell>{note.title}</TableCell>
                <TableCell className="max-w-md truncate">{note.content}</TableCell>
                <TableCell>{new Date(note.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{note.folder}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
