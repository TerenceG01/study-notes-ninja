
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AppearanceCardProps {
  resolvedTheme: string | undefined;
  onToggleTheme: () => void;
}

export function AppearanceCard({ resolvedTheme, onToggleTheme }: AppearanceCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Appearance</CardTitle>
        <CardDescription>Customize your app appearance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 rounded-lg border hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2">
            {resolvedTheme === "light" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="font-medium">
              {resolvedTheme === "light" ? "Light" : "Dark"} Mode
            </span>
          </div>
          <Button variant="outline" onClick={onToggleTheme} className="min-w-[100px]">
            {resolvedTheme === "light" ? "Dark Mode" : "Light Mode"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
