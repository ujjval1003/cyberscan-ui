import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { api, DashboardStats } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import {
  Users,
  Image,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getAdminDashboard();
      setStats(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      // Mock data for demo
      setStats({
        total_users: 156,
        total_images: 1247,
        forged_images: 342,
        authentic_images: 785,
        pending_analysis: 120,
        recent_uploads: [
          { date: "Mon", count: 45 },
          { date: "Tue", count: 52 },
          { date: "Wed", count: 38 },
          { date: "Thu", count: 67 },
          { date: "Fri", count: 89 },
          { date: "Sat", count: 34 },
          { date: "Sun", count: 28 },
        ],
        analysis_breakdown: { forged: 342, authentic: 785, pending: 120 },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = stats ? [
    { label: "Total Users", value: stats.total_users, icon: Users, color: "primary" },
    { label: "Total Images", value: stats.total_images, icon: Image, color: "secondary" },
    { label: "Forged Detected", value: stats.forged_images, icon: AlertTriangle, color: "destructive" },
    { label: "Authentic", value: stats.authentic_images, icon: CheckCircle, color: "secondary" },
    { label: "Pending", value: stats.pending_analysis, icon: Clock, color: "muted" },
  ] : [];

  const pieData = stats ? [
    { name: "Forged", value: stats.analysis_breakdown.forged, color: "hsl(var(--destructive))" },
    { name: "Authentic", value: stats.analysis_breakdown.authentic, color: "hsl(var(--secondary))" },
    { name: "Pending", value: stats.analysis_breakdown.pending, color: "hsl(var(--muted-foreground))" },
  ] : [];

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          System overview and analytics
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {statCards.map((stat, index) => (
          <GlassCard
            key={stat.label}
            className="relative overflow-hidden group hover:scale-105 transition-transform"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-${stat.color}/10`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart - Upload Trends */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Upload Trends</h2>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.recent_uploads || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: "hsl(var(--secondary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        {/* Bar Chart - Analysis Results */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-semibold">Weekly Analysis</h2>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.recent_uploads || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Pie Chart - Distribution */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold">Analysis Distribution</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              {pieData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="text-xl font-bold">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
