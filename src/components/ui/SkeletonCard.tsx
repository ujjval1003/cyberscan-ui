import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

interface SkeletonCardProps {
  variant?: "default" | "image" | "stat" | "table-row";
}

export const SkeletonCard = ({ variant = "default" }: SkeletonCardProps) => {
  const shimmerClass = "animate-pulse bg-muted/50 rounded";

  if (variant === "image") {
    return (
      <GlassCard className="overflow-hidden p-0">
        <div className="aspect-square bg-muted/30 animate-pulse" />
        <div className="p-4 space-y-3">
          <div className={`h-4 w-3/4 ${shimmerClass}`} />
          <div className="flex justify-between items-center">
            <div className={`h-3 w-1/4 ${shimmerClass}`} />
            <div className={`h-5 w-16 rounded-full ${shimmerClass}`} />
          </div>
        </div>
      </GlassCard>
    );
  }

  if (variant === "stat") {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${shimmerClass}`} />
          <div className="space-y-2 flex-1">
            <div className={`h-6 w-16 ${shimmerClass}`} />
            <div className={`h-4 w-24 ${shimmerClass}`} />
          </div>
        </div>
      </GlassCard>
    );
  }

  if (variant === "table-row") {
    return (
      <div className="flex items-center gap-4 p-4 border-b border-border/30">
        <div className={`w-10 h-10 rounded-full ${shimmerClass}`} />
        <div className="flex-1 space-y-2">
          <div className={`h-4 w-1/3 ${shimmerClass}`} />
          <div className={`h-3 w-1/4 ${shimmerClass}`} />
        </div>
        <div className={`h-5 w-16 rounded-full ${shimmerClass}`} />
        <div className="flex gap-2">
          <div className={`w-8 h-8 rounded ${shimmerClass}`} />
          <div className={`w-8 h-8 rounded ${shimmerClass}`} />
        </div>
      </div>
    );
  }

  return (
    <GlassCard className="p-6 space-y-4">
      <div className={`h-6 w-2/3 ${shimmerClass}`} />
      <div className={`h-4 w-full ${shimmerClass}`} />
      <div className={`h-4 w-5/6 ${shimmerClass}`} />
      <div className={`h-4 w-4/6 ${shimmerClass}`} />
    </GlassCard>
  );
};

export const SkeletonGrid = ({ count = 4, variant = "image" }: { count?: number; variant?: "image" | "stat" }) => {
  return (
    <div className={`grid gap-6 ${
      variant === "stat" 
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" 
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    }`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <SkeletonCard variant={variant} />
        </motion.div>
      ))}
    </div>
  );
};

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => {
  return (
    <GlassCard className="overflow-hidden p-0">
      <div className="p-4 border-b border-border/50">
        <div className="h-6 w-1/4 animate-pulse bg-muted/50 rounded" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <SkeletonCard variant="table-row" />
        </motion.div>
      ))}
    </GlassCard>
  );
};
