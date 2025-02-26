
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/components/navigation/NavigationItems";

interface NavigationSectionProps {
  isOpen: boolean;
}

export function NavigationSection({ isOpen }: NavigationSectionProps) {
  const location = useLocation();

  return (
    <div className="space-y-2 p-2">
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          variant={location.pathname === item.path ? "secondary" : "ghost"}
          className={cn(
            "w-full flex items-center",
            isOpen ? "justify-start px-3" : "justify-center px-0",
            location.pathname === item.path && "bg-accent/60"
          )}
          asChild
        >
          <Link to={item.path}>
            <item.icon className="h-4 w-4" />
            {isOpen && <span className="ml-3">{item.label}</span>}
          </Link>
        </Button>
      ))}
    </div>
  );
}
