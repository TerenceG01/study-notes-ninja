
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveContainerProps {
    children: React.ReactNode;
    className?: string;
    withPadding?: boolean;
    isPopup?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
    children,
    className,
    withPadding = true,
    isPopup = false
}) => {
    const isMobile = useIsMobile();
    
    return (
        <div
            className={cn(
                "w-full mx-auto max-w-[1400px] overflow-hidden",
                withPadding && (
                    isMobile 
                        ? "px-2 py-2" 
                        : "px-2 sm:px-6 lg:px-8 py-4 sm:py-6"
                ),
                isPopup && "max-w-[95vw] sm:max-w-[85vw] md:max-w-[75vw] lg:max-w-[65vw]",
                className
            )}
        >
            {children}
        </div>
    );
};
