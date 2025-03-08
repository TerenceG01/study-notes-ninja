
import { Loader2 } from "lucide-react";
import { NavigationBar } from "@/components/navigation/NavigationBar";

export const DeckLoading = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main className="container mx-auto px-4 pt-20">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </main>
    </div>
  );
};
