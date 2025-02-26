import { FileText, BookOpen, Users, User } from "lucide-react";

export interface NavigationItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

export const navigationItems: NavigationItem[] = [];

export const sidebarNavigationItems: NavigationItem[] = [
  { label: "My Notes", icon: FileText, path: "/notes" },
  { label: "My Flashcards", icon: BookOpen, path: "/flashcards" },
  { label: "Study Groups", icon: Users, path: "/study-groups" },
  { label: "My Profile", icon: User, path: "/profile" }
];

export const NavigationItems = () => {
  return (
    <nav className="hidden md:flex items-center space-x-6">
    </nav>
  );
};
