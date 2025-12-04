import { motion } from "framer-motion";
import { Loader2, CheckCircle, Zap, Brain } from "lucide-react";

interface AnalysisProgressProps {
  phase: 0 | 1 | 2;
  isAnalyzing: boolean;
  phase1Complete?: boolean;
  phase2Complete?: boolean;
}

export const AnalysisProgress = ({ 
  phase, 
  isAnalyzing, 
  phase1Complete = false, 
  phase2Complete = false 
}: AnalysisProgressProps) => {
  const steps = [
    { 
      id: 1, 
      label: "Phase 1", 
      description: "Error Level Analysis",
      icon: Zap,
      complete: phase1Complete,
      active: phase === 1 && isAnalyzing
    },
    { 
      id: 2, 
      label: "Phase 2", 
      description: "CNN Deep Analysis",
      icon: Brain,
      complete: phase2Complete,
      active: phase === 2 && isAnalyzing
    },
  ];

  return (
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute top-6 left-6 right-6 h-0.5 bg-muted">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary"
          initial={{ width: "0%" }}
          animate={{ 
            width: phase2Complete ? "100%" : phase1Complete ? "50%" : "0%" 
          }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          
          return (
            <motion.div
              key={step.id}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              {/* Step Circle */}
              <motion.div
                className={`relative w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                  step.complete 
                    ? "bg-secondary" 
                    : step.active 
                    ? "bg-primary" 
                    : "bg-muted"
                }`}
                animate={step.active ? {
                  boxShadow: [
                    "0 0 0 0 hsla(var(--primary), 0.4)",
                    "0 0 0 15px hsla(var(--primary), 0)",
                  ]
                } : {}}
                transition={step.active ? { duration: 1.5, repeat: Infinity } : {}}
              >
                {step.active ? (
                  <Loader2 className="w-6 h-6 animate-spin text-primary-foreground" />
                ) : step.complete ? (
                  <CheckCircle className="w-6 h-6 text-secondary-foreground" />
                ) : (
                  <Icon className="w-6 h-6 text-muted-foreground" />
                )}
              </motion.div>

              {/* Step Label */}
              <div className="mt-3 text-center">
                <p className={`font-medium ${
                  step.complete || step.active ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Active Status Message */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-4 h-4" />
            </motion.div>
            <span className="text-sm font-medium">
              {phase === 1 ? "Running ELA analysis..." : "Running CNN prediction..."}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
