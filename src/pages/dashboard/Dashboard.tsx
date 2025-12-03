import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { CyberButton } from "@/components/ui/CyberButton";
import { LoadingState } from "@/components/ui/LoadingState";
import { ApiErrorState } from "@/components/ui/ApiErrorState";
import { useAuth } from "@/contexts/AuthContext";
import { api, Image as ImageType } from "@/lib/api";
import { Link } from "react-router-dom";
import {
  Upload,
  FolderOpen,
  Search,
  TrendingUp,
  Image,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [images, setImages] = useState<ImageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.getImages();
      setImages(result.images || []);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzedImages = images.filter(img => img.analysis?.phase2_complete);
  const forgedCount = images.filter(img => img.analysis?.prediction === 'forged').length;
  const authenticCount = images.filter(img => img.analysis?.prediction === 'authentic').length;

  const stats = [
    { label: "Total Uploads", value: images.length.toString(), icon: Image, color: "primary" },
    { label: "Analyzed", value: analyzedImages.length.toString(), icon: CheckCircle, color: "secondary" },
    { label: "Forged Detected", value: forgedCount.toString(), icon: AlertTriangle, color: "accent" },
    { label: "Authentic", value: authenticCount.toString(), icon: TrendingUp, color: "primary" },
  ];

  const quickActions = [
    {
      icon: Upload,
      title: "Upload & Analyze",
      description: "Upload new images for forgery detection",
      path: "/dashboard/upload",
      color: "from-primary to-accent",
    },
    {
      icon: FolderOpen,
      title: "File Manager",
      description: "Manage your uploaded images",
      path: "/dashboard/files",
      color: "from-secondary to-primary",
    },
    {
      icon: Search,
      title: "Analysis Viewer",
      description: "View detailed analysis results",
      path: "/dashboard/analysis",
      color: "from-accent to-secondary",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  if (error) {
    return <ApiErrorState error={error} onRetry={fetchImages} title="Failed to load dashboard" />;
  }

  const recentImages = images.slice(0, 3);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, <span className="gradient-text">{user?.name || user?.email?.split("@")[0]}</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Your AI-powered image forensics dashboard
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <GlassCard
            key={stat.label}
            className="relative overflow-hidden group hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-${stat.color}/10`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}`} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-50 group-hover:opacity-100 transition-opacity" />
          </GlassCard>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link key={action.path} to={action.path}>
              <GlassCard
                className="h-full group cursor-pointer hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow`}>
                  <action.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
                <p className="text-muted-foreground">{action.description}</p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Recent Analysis</h2>
            <CyberButton variant="outline" size="sm" asChild>
              <Link to="/dashboard/files">View All</Link>
            </CyberButton>
          </div>
          
          {recentImages.length === 0 ? (
            <div className="text-center py-8">
              <Image className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No images uploaded yet</p>
              <CyberButton className="mt-4" asChild>
                <Link to="/dashboard/upload">Upload Your First Image</Link>
              </CyberButton>
            </div>
          ) : (
            <div className="space-y-4">
              {recentImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    {image.original_url ? (
                      <img src={image.original_url} alt={image.filename} className="w-full h-full object-cover" />
                    ) : (
                      <Image className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{image.filename}</p>
                    <p className="text-sm text-muted-foreground">
                      Uploaded {new Date(image.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                    image.analysis?.prediction === "forged"
                      ? "bg-destructive/20 text-destructive" 
                      : image.analysis?.prediction === "authentic"
                      ? "bg-secondary/20 text-secondary"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {image.analysis?.prediction === "forged" ? (
                      <><AlertTriangle className="w-3 h-3" /> Forged</>
                    ) : image.analysis?.prediction === "authentic" ? (
                      <><CheckCircle className="w-3 h-3" /> Authentic</>
                    ) : (
                      <><Clock className="w-3 h-3" /> Pending</>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
