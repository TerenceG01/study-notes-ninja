
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
                        ? "px-2 py-1" 
                        : "px-2 sm:px-4 lg:px-6 py-2 sm:py-3"
                ),
                isPopup && "max-w-[95vw] sm:max-w-[85vw] md:max-w-[75vw] lg:max-w-[65vw]",
                className
            )}
        >
            {children}
        </div>
    );
};
