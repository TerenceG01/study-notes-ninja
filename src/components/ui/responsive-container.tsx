
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
                "w-full mx-auto max-w-[1600px] overflow-hidden",
                withPadding && (
                    isMobile 
                        ? "px-1 py-1" 
                        : "px-2 sm:px-4 lg:px-6 py-2"
                ),
                isPopup && "max-w-[98vw] sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw]",
                className
            )}
        >
            {children}
        </div>
    );
};
