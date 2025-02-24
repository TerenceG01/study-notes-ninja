
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { NavigationBar } from "@/components/navigation/NavigationBar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center py-12 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
          <a href="/" className="text-blue-500 hover:text-blue-700 underline">
            Return to Home
          </a>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
