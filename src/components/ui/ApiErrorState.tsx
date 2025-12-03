import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { CyberButton } from "@/components/ui/CyberButton";
import { WifiOff, AlertCircle, RefreshCw, ServerCrash } from "lucide-react";
import { ApiError } from "@/lib/api";

interface ApiErrorStateProps {
  error: Error | ApiError;
  onRetry?: () => void;
  title?: string;
}

export const ApiErrorState = ({ error, onRetry, title }: ApiErrorStateProps) => {
  const isNetworkError = error instanceof ApiError && error.isNetworkError;
  const isServerError = error instanceof ApiError && error.statusCode && error.statusCode >= 500;

  const Icon = isNetworkError ? WifiOff : isServerError ? ServerCrash : AlertCircle;
  const displayTitle = title || (isNetworkError ? "Connection Error" : isServerError ? "Server Error" : "Error");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center py-12"
    >
      <GlassCard className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{displayTitle}</h3>
        <p className="text-muted-foreground mb-6">{error.message}</p>
        {onRetry && (
          <CyberButton onClick={onRetry} variant="outline">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </CyberButton>
        )}
      </GlassCard>
    </motion.div>
  );
};
