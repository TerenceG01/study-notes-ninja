
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveContainerProps {
    children: React.ReactNode;
    className?: string;
    withPadding?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
    children,
    className,
    withPadding = true
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
                className
            )}
        >
            {children}
        </div>
    );
};
