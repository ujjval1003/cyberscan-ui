import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { CyberButton } from "@/components/ui/CyberButton";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { ShieldOff, Home, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg"
      >
        <GlassCard className="text-center p-8">
          {/* Animated Shield Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative mx-auto mb-8"
          >
            <div className="w-32 h-32 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 20px hsla(var(--destructive), 0.3)",
                    "0 0 40px hsla(var(--destructive), 0.5)",
                    "0 0 20px hsla(var(--destructive), 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-full bg-destructive/20 flex items-center justify-center"
              >
                <ShieldOff className="w-12 h-12 text-destructive" />
              </motion.div>
            </div>
            
            {/* Animated rings */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-destructive/30"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Error Code */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl font-bold gradient-text mb-4"
          >
            403
          </motion.h1>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-semibold mb-4"
          >
            Access Denied
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground mb-8"
          >
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <CyberButton variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </CyberButton>
            <CyberButton asChild>
              <Link to="/">
                <Home className="w-4 h-4" />
                Return Home
              </Link>
            </CyberButton>
          </motion.div>

          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-8 h-1 bg-gradient-to-r from-transparent via-destructive/50 to-transparent rounded-full"
          />
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Forbidden;
