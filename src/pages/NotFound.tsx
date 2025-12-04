import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { CyberButton } from "@/components/ui/CyberButton";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Home, Search, Compass } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // Glitch text animation variants
  const glitchVariants = {
    animate: {
      textShadow: [
        "2px 0 hsl(var(--primary)), -2px 0 hsl(var(--secondary))",
        "-2px 0 hsl(var(--primary)), 2px 0 hsl(var(--secondary))",
        "2px 0 hsl(var(--accent)), -2px 0 hsl(var(--primary))",
        "0 0 hsl(var(--primary)), 0 0 hsl(var(--secondary))",
      ],
      x: [0, -2, 2, 0],
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-20 w-4 h-4 rounded-full bg-primary/30"
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-40 right-20 w-6 h-6 rounded-full bg-secondary/30"
        animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />
      <motion.div
        className="absolute top-40 right-40 w-3 h-3 rounded-full bg-accent/30"
        animate={{ y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg"
      >
        <GlassCard className="text-center p-8">
          {/* Compass Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative mx-auto mb-6"
          >
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <Compass className="w-14 h-14 text-primary" />
              </motion.div>
            </div>
            
            {/* Pulsing rings */}
            <motion.div
              className="absolute inset-0 rounded-full border border-primary/30"
              animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border border-secondary/30"
              animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </motion.div>

          {/* Glitch 404 */}
          <motion.h1
            variants={glitchVariants}
            animate="animate"
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            className="text-8xl font-bold gradient-text mb-4 font-mono"
          >
            404
          </motion.h1>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-semibold mb-4"
          >
            Page Not Found
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mb-2"
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-muted-foreground/60 mb-8 font-mono"
          >
            Attempted: {location.pathname}
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <CyberButton asChild>
              <Link to="/">
                <Home className="w-4 h-4" />
                Return Home
              </Link>
            </CyberButton>
            <CyberButton variant="outline" asChild>
              <Link to="/dashboard">
                <Search className="w-4 h-4" />
                Go to Dashboard
              </Link>
            </CyberButton>
          </motion.div>

          {/* Scan Line Effect */}
          <motion.div
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            initial={{ top: 0 }}
            animate={{ top: "100%" }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Decorative Gradient Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-8 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
          />
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default NotFound;
