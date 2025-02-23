
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { NavigationBar } from "@/components/navigation/NavigationBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background w-full">
      <NavigationBar />
      <div className="pt-16 w-full">
        <Hero />
        <Features />
      </div>
    </div>
  );
};

export default Index;
