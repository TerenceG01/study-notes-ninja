
import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface AppearanceCardProps {
  resolvedTheme: string | undefined;
  onToggleTheme: () => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
}

// Available accent colors
const accentColors = [
  { name: "Purple", value: "purple", class: "bg-purple-500" },
  { name: "Blue", value: "blue", class: "bg-blue-500" },
  { name: "Green", value: "green", class: "bg-green-500" },
  { name: "Orange", value: "orange", class: "bg-orange-500" },
  { name: "Pink", value: "pink", class: "bg-pink-500" }
];

export function AppearanceCard({ 
  resolvedTheme, 
  onToggleTheme, 
  accentColor, 
  onAccentColorChange 
}: AppearanceCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Appearance</CardTitle>
        <CardDescription>Customize your app appearance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Toggle Section */}
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

        {/* Accent Color Section */}
        <div className="flex flex-col space-y-4 p-4 rounded-lg border hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <span className="font-medium">Accent Color</span>
          </div>
          
          <RadioGroup 
            value={accentColor} 
            onValueChange={onAccentColorChange}
            className="flex flex-wrap gap-4 mt-2"
          >
            {accentColors.map((color) => (
              <div key={color.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={color.value}
                  id={`color-${color.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`color-${color.value}`}
                  className="flex flex-col items-center justify-center rounded-full p-1 cursor-pointer border-2 transition-all peer-data-[state=checked]:border-black dark:peer-data-[state=checked]:border-white"
                >
                  <div 
                    className={`${color.class} w-8 h-8 rounded-full`}
                    aria-label={color.name}
                  />
                  <span className="text-xs mt-1">{color.name}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
