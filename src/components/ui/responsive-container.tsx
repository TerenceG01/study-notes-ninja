
import { cn } from "@/lib/utils";

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
    return (
        <div
            className={cn(
                "w-full mx-auto max-w-[1400px] overflow-hidden",
                withPadding && "px-2 sm:px-6 lg:px-8 py-2 sm:py-4 lg:py-6", // Reduced padding on mobile
                className
            )}
        >
            {children}
        </div>
    );
};
