import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { CyberButton } from "@/components/ui/CyberButton";
import { LoadingState } from "@/components/ui/LoadingState";
import { ApiErrorState } from "@/components/ui/ApiErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { api, User, Image as ImageType } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  User as UserIcon,
  Mail,
  Calendar,
  Image,
  Shield,
  Briefcase,
  Download,
  Trash2,
  Edit,
  FolderOpen,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [images, setImages] = useState<ImageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [userData, imagesData] = await Promise.all([
        api.getUser(userId!),
        api.getUserImages(userId!),
      ]);
      setUser(userData);
      setImages(imagesData.images || []);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userId) return;
    setIsDeleting(true);
    try {
      await api.deleteUser(userId);
      toast({
        title: "User Deleted",
        description: "User has been permanently deleted.",
      });
      navigate("/admin/users");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async () => {
    if (!userId) return;
    setIsDownloading(true);
    try {
      await api.downloadUserData(userId);
      toast({
        title: "Download Started",
        description: "User data download has started.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: { bg: "bg-primary/20", text: "text-primary", icon: Shield },
      employee: { bg: "bg-accent/20", text: "text-accent", icon: Briefcase },
      user: { bg: "bg-secondary/20", text: "text-secondary", icon: UserIcon },
    };
    const style = styles[role as keyof typeof styles] || styles.user;
    const Icon = style.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${style.bg} ${style.text}`}>
        <Icon className="w-4 h-4" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (analysis?: ImageType["analysis"]) => {
    if (!analysis || analysis.prediction === "pending") {
      return (
        <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
          <Clock className="w-3 h-3" /> Pending
        </span>
      );
    }
    if (analysis.prediction === "forged") {
      return (
        <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-destructive/20 text-destructive">
          <AlertTriangle className="w-3 h-3" /> Forged
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-secondary/20 text-secondary">
        <CheckCircle className="w-3 h-3" /> Authentic
      </span>
    );
  };

  if (isLoading) {
    return <LoadingState message="Loading user profile..." />;
  }

  if (error) {
    return <ApiErrorState error={error} onRetry={fetchData} title="Failed to load user" />;
  }

  if (!user) {
    return (
      <EmptyState
        icon={UserIcon}
        title="User Not Found"
        description="The requested user could not be found."
        action={{ label: "Back to Users", href: "/admin/users" }}
      />
    );
  }

  const forgedCount = images.filter(img => img.analysis?.prediction === "forged").length;
  const authenticCount = images.filter(img => img.analysis?.prediction === "authentic").length;
  const pendingCount = images.filter(img => !img.analysis || img.analysis.prediction === "pending").length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <CyberButton variant="ghost" size="sm" asChild>
          <Link to="/admin/users">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </CyberButton>
      </div>

      {/* User Info Card */}
      <GlassCard className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
        
        <div className="relative flex flex-col md:flex-row gap-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-cyber flex items-center justify-center">
              <UserIcon className="w-12 h-12 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              <div className="mt-3">{getRoleBadge(user.role)}</div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 md:ml-auto">
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold">{images.length}</p>
              <p className="text-sm text-muted-foreground">Total Images</p>
            </div>
            <div className="p-4 rounded-lg bg-destructive/10">
              <p className="text-2xl font-bold text-destructive">{forgedCount}</p>
              <p className="text-sm text-muted-foreground">Forged</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/10">
              <p className="text-2xl font-bold text-secondary">{authenticCount}</p>
              <p className="text-sm text-muted-foreground">Authentic</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-border/50">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Joined {new Date(user.created_at).toLocaleDateString()}
          </span>
        </div>
      </GlassCard>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <CyberButton asChild>
          <Link to={`/admin/users/${userId}/images`}>
            <FolderOpen className="w-4 h-4" />
            View All Images
          </Link>
        </CyberButton>
        <CyberButton 
          variant="outline" 
          onClick={handleDownload}
          isLoading={isDownloading}
        >
          <Download className="w-4 h-4" />
          Download Data
        </CyberButton>
        <ConfirmDialog
          trigger={
            <CyberButton variant="danger">
              <Trash2 className="w-4 h-4" />
              Delete User
            </CyberButton>
          }
          title="Delete User?"
          description={`This will permanently delete ${user.name} and all their data. This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={handleDelete}
          isLoading={isDeleting}
        />
      </div>

      {/* Recent Images */}
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" />
            Recent Images
          </h2>
          {images.length > 6 && (
            <CyberButton variant="outline" size="sm" asChild>
              <Link to={`/admin/users/${userId}/images`}>View All</Link>
            </CyberButton>
          )}
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No images uploaded</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {images.slice(0, 6).map((image) => (
              <Link
                key={image.id}
                to={`/admin/users/${userId}/images/${image.id}`}
                className="group"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted/30">
                  <img
                    src={image.original_url}
                    alt={image.filename}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {getStatusBadge(image.analysis)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
};

export default UserProfile;
