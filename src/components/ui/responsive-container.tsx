
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
                "w-full mx-auto max-w-full overflow-hidden",
                withPadding && (
                    isMobile 
                        ? "px-1 py-1" 
                        : "px-2 sm:px-2 lg:px-2 py-2"
                ),
                isPopup && "max-w-full",
                className
            )}
        >
            {children}
        </div>
    );
};
