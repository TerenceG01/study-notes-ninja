
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
        "w-full mx-auto max-w-[1400px]",
        withPadding && "px-4 sm:px-6 lg:px-8 py-4 sm:py-6",
        className
      )}
    >
      {children}
    </div>
  );
};
