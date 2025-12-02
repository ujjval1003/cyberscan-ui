import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { CyberButton } from "@/components/ui/CyberButton";
import { api, Image as ImageType, User } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import {
  FolderOpen,
  Image,
  Trash2,
  Eye,
  Download,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserImages = () => {
  const { userId } = useParams<{ userId: string }>();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(userId || null);
  const [images, setImages] = useState<ImageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchImages();
    }
  }, [selectedUserId]);

  const fetchUsers = async () => {
    try {
      const result = await api.getUsers();
      setUsers(result.users);
      if (!selectedUserId && result.users.length > 0) {
        setSelectedUserId(result.users[0].id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      if (!selectedUserId) {
        setIsLoading(false);
      }
    }
  };

  const fetchImages = async () => {
    if (!selectedUserId) return;
    setIsLoading(true);
    try {
      const result = await api.getUserImages(selectedUserId);
      setImages(result.images);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!selectedUserId) return;
    setDeletingId(imageId);
    try {
      await api.deleteUserImage(selectedUserId, imageId);
      setImages(images.filter((img) => img.id !== imageId));
      toast({
        title: "Deleted",
        description: "Image deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAllImages = async () => {
    if (!selectedUserId) return;
    try {
      await api.deleteUserImages(selectedUserId);
      setImages([]);
      toast({
        title: "Deleted",
        description: "All images deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (analysis?: ImageType["analysis"]) => {
    if (!analysis) {
      return (
        <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    }
    if (analysis.prediction === "forged") {
      return (
        <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-destructive/20 text-destructive">
          <AlertTriangle className="w-3 h-3" />
          Forged
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-secondary/20 text-secondary">
        <CheckCircle className="w-3 h-3" />
        Authentic
      </span>
    );
  };

  const selectedUser = users.find((u) => u.id === selectedUserId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">User Images</h1>
          <p className="text-muted-foreground text-lg">
            Manage images for selected user
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={selectedUserId || ""}
            onValueChange={setSelectedUserId}
          >
            <SelectTrigger className="w-[250px] bg-muted/50 border-border/50">
              <Users className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedUserId && images.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <CyberButton variant="danger" size="sm">
                  <Trash2 className="w-4 h-4" />
                  Delete All
                </CyberButton>
              </AlertDialogTrigger>
              <AlertDialogContent className="glass-panel border-border/50">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete All Images?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all images for {selectedUser?.name}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-muted hover:bg-muted/80">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAllImages}
                    className="bg-destructive hover:bg-destructive/80"
                  >
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* User Info Card */}
      {selectedUser && (
        <GlassCard className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-gradient-cyber flex items-center justify-center">
            <Users className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
            <p className="text-muted-foreground">{selectedUser.email}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{images.length}</p>
            <p className="text-muted-foreground">Total Images</p>
          </div>
        </GlassCard>
      )}

      {/* Images Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : !selectedUserId ? (
        <GlassCard className="text-center py-16">
          <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Select a User</h3>
          <p className="text-muted-foreground">
            Choose a user to view their images
          </p>
        </GlassCard>
      ) : images.length === 0 ? (
        <GlassCard className="text-center py-16">
          <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Images</h3>
          <p className="text-muted-foreground">
            This user hasn't uploaded any images yet
          </p>
        </GlassCard>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          layout
        >
          <AnimatePresence>
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="group overflow-hidden p-0">
                  <div className="relative aspect-square">
                    <img
                      src={image.original_url}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                      <div className="flex gap-2">
                        <CyberButton
                          size="sm"
                          variant="outline"
                          asChild
                          className="flex-1"
                        >
                          <Link to={`/admin/users/${selectedUserId}/images/${image.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </CyberButton>
                        <CyberButton
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteImage(image.id)}
                          isLoading={deletingId === image.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </CyberButton>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-medium truncate">{image.filename}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(image.uploaded_at).toLocaleDateString()}
                      </span>
                      {getStatusBadge(image.analysis)}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserImages;
