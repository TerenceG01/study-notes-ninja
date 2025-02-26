
import { FileText, BookOpen, Users, User } from "lucide-react";

export interface NavigationItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

export const navigationItems: NavigationItem[] = [
  { label: "My Notes", icon: FileText, path: "/notes" },
  { label: "My Flashcards", icon: BookOpen, path: "/flashcards" },
  { label: "Study Groups", icon: Users, path: "/study-groups" },
  { label: "My Profile", icon: User, path: "/profile" },
];
