import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  asChild?: boolean;
}

const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, asChild, children, disabled, ...props }, ref) => {
    const baseClasses = "relative font-semibold rounded-lg overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2";

    const variants = {
      primary: "bg-gradient-cyber text-primary-foreground hover:shadow-[0_0_30px_hsla(var(--cyber-blue),0.6)] hover:scale-105",
      outline: "border border-primary bg-transparent text-primary hover:bg-primary/10 hover:shadow-[0_0_20px_hsla(var(--cyber-blue),0.4)]",
      ghost: "bg-transparent text-foreground hover:bg-muted",
      danger: "bg-destructive text-destructive-foreground hover:shadow-[0_0_20px_hsla(var(--destructive),0.6)] hover:scale-105",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </Comp>
    );
  }
);

CyberButton.displayName = "CyberButton";

export { CyberButton };
