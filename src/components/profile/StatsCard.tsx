
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
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
          <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Activity & Statistics
        </CardTitle>
        <CardDescription>Track your progress and activity</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-md border p-3 sm:p-4 hover:bg-muted/50 transition-colors">
          <div className="bg-primary/10 p-1.5 sm:p-2 rounded-full">
            <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-xs sm:text-sm font-medium leading-none">Member Since</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {isLoading ? "Loading..." : new Date(joinDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-md border p-3 sm:p-4 hover:bg-muted/50 transition-colors">
          <div className="bg-primary/10 p-1.5 sm:p-2 rounded-full">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-xs sm:text-sm font-medium leading-none">Total Notes</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {isLoading ? "Loading..." : notesCount} notes created
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-md border p-3 sm:p-4 hover:bg-muted/50 transition-colors">
          <div className="bg-primary/10 p-1.5 sm:p-2 rounded-full">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-xs sm:text-sm font-medium leading-none">Flashcards</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {isLoading ? "Loading..." : flashcardsCount} cards created
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-md border p-3 sm:p-4 hover:bg-muted/50 transition-colors">
          <div className="bg-primary/10 p-1.5 sm:p-2 rounded-full">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-xs sm:text-sm font-medium leading-none">Study Streak</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {isLoading ? "Loading..." : studyStreakDays} days
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
