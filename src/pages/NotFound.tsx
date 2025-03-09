
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ProfileButton } from "@/components/navigation/ProfileButton";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { useSidebar } from "@/components/ui/sidebar";

const NotFound = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const isOpen = state === "expanded";

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <ProfileButton />
      <main className={`transition-all duration-300 ${isOpen ? 'ml-40' : 'ml-20'} w-[calc(100%-theme(spacing.40))] max-w-full overflow-x-hidden`}>
        <ResponsiveContainer>
          <div className="text-center py-12 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
            <a href="/" className="text-blue-500 hover:text-blue-700 underline">
              Return to Home
            </a>
          </div>
        </ResponsiveContainer>
      </main>
    </div>
  );
};

export default NotFound;
