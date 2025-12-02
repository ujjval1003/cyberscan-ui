import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CyberButton } from "@/components/ui/CyberButton";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Shield,
  Scan,
  Brain,
  Zap,
  Lock,
  BarChart3,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Scan,
      title: "Error Level Analysis",
      description: "Detect compression artifacts and manipulation traces in images",
    },
    {
      icon: Brain,
      title: "AI-Powered Detection",
      description: "Deep learning models trained on millions of forged images",
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Get results in seconds with our optimized pipeline",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "Enterprise-grade security with encrypted data storage",
    },
    {
      icon: BarChart3,
      title: "Detailed Reports",
      description: "Comprehensive analysis with probability scores",
    },
    {
      icon: Shield,
      title: "Forensic Grade",
      description: "Professional-level detection used by experts",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl top-[10%] left-[10%] animate-pulse" />
        <div className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 blur-3xl top-[50%] right-[10%] animate-pulse" />
        <div className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-accent/15 to-secondary/15 blur-3xl bottom-[20%] left-[30%] animate-pulse" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl gradient-text">ForgeGuard</span>
          </div>
          <div className="flex items-center gap-4">
            <CyberButton variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </CyberButton>
            <CyberButton asChild>
              <Link to="/login">Get Started</Link>
            </CyberButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-6">
        <motion.div
          className="container mx-auto text-center max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium text-foreground">
              <Zap className="w-4 h-4 text-secondary" />
              AI-Powered Image Forensics
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-foreground">
            Detect Image
            <br />
            <span className="gradient-text">Forgery</span> Instantly
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Professional-grade AI detection system that identifies manipulated images
            with forensic accuracy. Protect your organization from visual deception.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CyberButton size="lg" asChild>
              <Link to="/login">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </CyberButton>
            <CyberButton variant="outline" size="lg">
              Watch Demo
            </CyberButton>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-secondary" />
              <span>99.2% Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-secondary" />
              <span>Sub-second Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-secondary" />
              <span>Enterprise Ready</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Advanced <span className="gradient-text">Detection</span> Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for professional image forensics analysis
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="h-full group hover:scale-105 transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow">
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <motion.div
          className="container mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard variant="neon" className="text-center py-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Ready to <span className="gradient-text">Protect</span> Your Organization?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who trust ForgeGuard for image verification.
            </p>
            <CyberButton size="lg" asChild>
              <Link to="/login">
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </CyberButton>
          </GlassCard>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/50">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span>© 2024 ForgeGuard. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
