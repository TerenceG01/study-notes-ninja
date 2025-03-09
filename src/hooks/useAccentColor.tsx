
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/use-toast";

export const useAccentColor = () => {
  const [accentColor, setAccentColor] = useState("purple");
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();
  const { toast } = useToast();

  // Function to apply accent color to CSS variables
  const applyAccentColor = (color: string) => {
    // Tailwind doesn't support dynamic classes at runtime
    // So we manually update CSS variables that could be used in the theme
    const root = document.documentElement;
    
    // Map color values to Tailwind color values
    const colorMap: Record<string, { light: string, dark: string }> = {
      purple: { 
        light: "271 81% 50%", // #6D28D9
        dark: "240 84% 67%"   // #6366F1
      },
      blue: { 
        light: "217 91% 60%", // #3B82F6
        dark: "231 77% 61%"   // #598EF3
      },
      green: { 
        light: "158 64% 52%", // #10B981
        dark: "160 84% 39%"   // #059669
      },
      orange: { 
        light: "21 90% 58%",  // #F97316
        dark: "20 90% 55%"    // #EA580C
      },
      pink: { 
        light: "326 78% 60%", // #EC4899
        dark: "330 81% 60%"   // #DB2777
      }
    };

    const themeMode = resolvedTheme === 'dark' ? 'dark' : 'light';
    const colorValue = colorMap[color]?.[themeMode] || colorMap.purple[themeMode];
    
    // Update primary color variables
    root.style.setProperty('--primary', colorValue);
  };

  const fetchAccentColor = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("accent_color")
        .eq("id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data && data.accent_color) {
        setAccentColor(data.accent_color);
        applyAccentColor(data.accent_color);
      }
    } catch (error) {
      console.error("Error fetching accent color:", error);
    }
  };

  const updateAccentColor = async (color: string) => {
    setAccentColor(color);
    applyAccentColor(color);
    
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ accent_color: color })
        .eq("id", user.id);
        
      if (error) throw error;
      
      toast({
        title: "Accent color updated",
        description: `Theme accent color changed to ${color}`,
      });
    } catch (error) {
      console.error("Error updating accent color:", error);
      toast({
        variant: "destructive",
        title: "Error updating accent color",
        description: error instanceof Error ? error.message : "An error occurred"
      });
    }
  };

  // Apply accent color whenever the user or theme changes
  useEffect(() => {
    if (user) {
      fetchAccentColor();
    }
  }, [user, resolvedTheme]);

  return {
    accentColor,
    updateAccentColor,
    applyAccentColor
  };
};
