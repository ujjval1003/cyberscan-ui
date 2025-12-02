import { motion } from "framer-motion";

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "10%", left: "10%" }}
      />
      
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "50%", right: "10%" }}
      />
      
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-accent/15 to-secondary/15 blur-3xl"
        animate={{
          x: [0, 60, 0],
          y: [0, -60, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: "20%", left: "30%" }}
      />
      
      {/* Scan lines */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};
