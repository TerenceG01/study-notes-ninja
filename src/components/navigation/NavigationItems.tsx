
import { FileText, BookOpen, Users } from "lucide-react";

export interface NavigationItem {
  label: string;
  icon: React.ElementType;
  path: string;
  activeCheck: (pathname: string) => boolean;
  mobileLabel?: string;
}

export const navigationItems: NavigationItem[] = [
  { 
    label: "My Notes", 
    icon: FileText, 
    path: "/notes",
    activeCheck: (pathname) => pathname === "/notes",
    mobileLabel: "Notes"
  },
  { 
    label: "My Flashcards", 
    icon: BookOpen, 
    path: "/flashcards",
    activeCheck: (pathname) => pathname.startsWith("/flashcards"),
    mobileLabel: "Cards"
  },
  { 
    label: "Study Groups", 
    icon: Users, 
    path: "/study-groups",
    activeCheck: (pathname) => pathname.startsWith("/study-groups"),
    mobileLabel: "Groups"
  },
];
