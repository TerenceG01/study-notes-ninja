
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveContainerProps {
    children: React.ReactNode;
    className?: string;
    withPadding?: boolean;
    fullWidth?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
    children,
    className,
    withPadding = true,
    fullWidth = false
}) => {
    const isMobile = useIsMobile();
    
    return (
        <div
            className={cn(
                "w-full min-w-full mx-auto overflow-hidden",
                !fullWidth && "max-w-[100%]", 
                fullWidth && "max-w-full",
                withPadding && (
                    isMobile 
                        ? "px-1 py-2" 
                        : "px-1 sm:px-2 py-4"
                ),
                className
            )}
        >
            {children}
        </div>
    );
};
