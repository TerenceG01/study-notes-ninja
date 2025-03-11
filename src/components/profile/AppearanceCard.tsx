
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AppearanceCardProps {
  resolvedTheme: string | undefined;
  onToggleTheme: () => void;
}

export function AppearanceCard({ resolvedTheme, onToggleTheme }: AppearanceCardProps) {
  const handleThemeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Call the theme toggle function in a safe manner
    // Use requestAnimationFrame to ensure DOM updates are properly handled
    requestAnimationFrame(() => {
      onToggleTheme();
      
      // Make sure pointer events are enabled after theme toggle
      setTimeout(() => {
        document.body.style.pointerEvents = '';
        document.documentElement.style.pointerEvents = '';
        
        // Reset all elements with pointer-events style
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
          if (element instanceof HTMLElement && element.style.pointerEvents === 'none') {
            element.style.pointerEvents = '';
          }
        });
        
        // Force browser repaint
        document.body.getBoundingClientRect();
      }, 100);
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl">Appearance</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Customize your app appearance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-lg border hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            {resolvedTheme === "light" ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
            <span className="text-sm font-medium">
              {resolvedTheme === "light" ? "Light" : "Dark"} Mode
            </span>
          </div>
          <Button 
            variant="outline" 
            onClick={handleThemeToggle} 
            className="min-w-[100px] text-xs sm:text-sm py-1.5 sm:py-2"
            type="button"
          >
            {resolvedTheme === "light" ? "Dark Mode" : "Light Mode"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
