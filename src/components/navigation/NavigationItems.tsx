import { FileText, BookOpen, Users, User } from "lucide-react";

export interface NavigationItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

// Keep header navigation empty
export const navigationItems: NavigationItem[] = [];

// Add back sidebar navigation items
export const sidebarNavigationItems: NavigationItem[] = [
  { label: "My Notes", icon: FileText, path: "/notes" },
  { label: "My Flashcards", icon: BookOpen, path: "/flashcards" },
  { label: "Study Groups", icon: Users, path: "/study-groups" },
  { label: "My Profile", icon: User, path: "/profile" }
];

export const NavigationItems = () => {
  return (
    <nav className="hidden md:flex items-center space-x-6">
      {navigationItems.map((item) => (
        <a
          key={item.path}
          href={item.path}
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
};
