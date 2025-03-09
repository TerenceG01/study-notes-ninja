
import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AppearanceCardProps {
  resolvedTheme: string | undefined;
  onToggleTheme: () => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
}

// Available accent colors with improved descriptions and visual properties
const accentColors = [
  { name: "Purple", value: "purple", class: "bg-purple-500", gradient: "from-purple-400 to-purple-600" },
  { name: "Blue", value: "blue", class: "bg-blue-500", gradient: "from-blue-400 to-blue-600" },
  { name: "Green", value: "green", class: "bg-green-500", gradient: "from-green-400 to-green-600" },
  { name: "Orange", value: "orange", class: "bg-orange-500", gradient: "from-orange-400 to-orange-600" },
  { name: "Pink", value: "pink", class: "bg-pink-500", gradient: "from-pink-400 to-pink-600" }
];

export function AppearanceCard({ 
  resolvedTheme, 
  onToggleTheme, 
  accentColor, 
  onAccentColorChange 
}: AppearanceCardProps) {
  // Get the current color's background class
  const getSelectedColorClass = (colorValue: string) => {
    const color = accentColors.find(c => c.value === colorValue);
    return color ? color.class : "bg-purple-500";
  };

  // Handle color selection with better focus management
  const handleColorChange = (color: string) => {
    // Use requestAnimationFrame to ensure UI updates first
    // This helps prevent interaction issues on other pages
    requestAnimationFrame(() => {
      onAccentColorChange(color);
    });
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Appearance
        </CardTitle>
        <CardDescription>Customize how the app looks for you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Toggle Section - Enhanced with visual indicators */}
        <div className="rounded-lg border hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-secondary/30">
            <div className="flex items-center gap-2">
              {resolvedTheme === "light" ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-blue-400" />
              )}
              <span className="font-medium">
                {resolvedTheme === "light" ? "Light" : "Dark"} Mode
              </span>
            </div>
            <Button 
              variant="outline" 
              onClick={onToggleTheme} 
              className="min-w-[100px]"
              type="button"
            >
              {resolvedTheme === "light" ? "Dark Mode" : "Light Mode"}
            </Button>
          </div>
        </div>

        {/* Accent Color Section - Completely redesigned */}
        <div className="rounded-lg border overflow-hidden">
          <div className="p-4 bg-secondary/30 flex items-center gap-2 border-b">
            <Palette className="h-5 w-5" />
            <span className="font-medium">Accent Color</span>
          </div>
          
          <div className="p-5 grid grid-cols-2 md:grid-cols-5 gap-4">
            {accentColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorChange(color.value)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg transition-all",
                  "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary",
                  accentColor === color.value ? "ring-2 ring-primary bg-secondary/40" : "hover:bg-secondary/20"
                )}
                aria-label={`Set accent color to ${color.name}`}
                type="button"
              >
                <div 
                  className={cn(
                    "w-12 h-12 rounded-full bg-gradient-to-br shadow-md", 
                    color.gradient,
                    accentColor === color.value ? "ring-2 ring-offset-2 ring-primary" : ""
                  )}
                />
                <span className="text-sm font-medium">{color.name}</span>
              </button>
            ))}
          </div>
          
          <div className="p-4 bg-muted/30 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Selected: <span className="font-medium text-foreground capitalize">{accentColor}</span></span>
              <div className={cn(
                "w-6 h-6 rounded-full",
                getSelectedColorClass(accentColor)
              )}></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
