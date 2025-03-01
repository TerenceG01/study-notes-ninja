
import { 
  CalendarDays, 
  BookOpen, 
  Trophy, 
  Activity, 
  Clock 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  joinDate: string;
  notesCount?: number;
  flashcardsCount?: number;
  studyStreakDays?: number;
  isLoading: boolean;
}

export function StatsCard({ 
  joinDate, 
  notesCount = 0, 
  flashcardsCount = 0, 
  studyStreakDays = 0,
  isLoading 
}: StatsCardProps) {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Activity & Statistics
        </CardTitle>
        <CardDescription>Track your progress and activity</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center gap-4 rounded-md border p-4 hover:bg-muted/50 transition-colors">
          <div className="bg-primary/10 p-2 rounded-full">
            <CalendarDays className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Member Since</p>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : new Date(joinDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-md border p-4 hover:bg-muted/50 transition-colors">
          <div className="bg-primary/10 p-2 rounded-full">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Total Notes</p>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : notesCount} notes created
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-md border p-4 hover:bg-muted/50 transition-colors">
          <div className="bg-primary/10 p-2 rounded-full">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Flashcards</p>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : flashcardsCount} cards created
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-md border p-4 hover:bg-muted/50 transition-colors">
          <div className="bg-primary/10 p-2 rounded-full">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Study Streak</p>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : studyStreakDays} days
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
