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
              </div>div>
        );
};

// Enhancements for mobile responsiveness
// Use media queries in Tailwind CSS for additional fine-tuning
// Example media query: '@media (max-width: 640px) { ... }'

// Add ARIA labels for accessibility
// Example: <div aria-label="responsive container">...</div>
</div>
