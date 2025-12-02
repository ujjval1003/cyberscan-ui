import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "strong" | "neon";
  glow?: "primary" | "secondary" | "accent" | "none";
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", glow = "none", children, ...props }, ref) => {
    const variants = {
      default: "glass-panel",
      strong: "glass-panel-strong",
      neon: "glass-panel neon-border",
    };

    const glowClasses = {
      primary: "glow-primary",
      secondary: "glow-secondary",
      accent: "glow-accent",
      none: "",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          variants[variant],
          glowClasses[glow],
          "p-6",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
