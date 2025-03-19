
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ProfileButton } from "@/components/navigation/ProfileButton";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <ProfileButton />
      <ResponsiveContainer className="flex items-center justify-center min-h-[80vh] overflow-hidden">
        <div className="text-center py-12 animate-[fadeSlideIn_0.5s_ease-out_forwards] max-w-full px-2 sm:px-4">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">{t("pageNotFound")}</p>
          <a href="/" className="text-blue-500 hover:text-blue-700 underline">
            {t("returnToHome")}
          </a>
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export default NotFound;
