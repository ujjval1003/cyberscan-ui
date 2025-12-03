import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { CyberButton } from "@/components/ui/CyberButton";
import { LoadingState } from "@/components/ui/LoadingState";
import { ApiErrorState } from "@/components/ui/ApiErrorState";
import { api, Image as ImageType } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import {
  FolderOpen,
  Image,
  Trash2,
  Eye,
  Loader2,
  Search,
  Grid,
  List,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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

const FileManager = () => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.deleteImage(id);
      setImages(images.filter((img) => img.id !== id));
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

  const handleDeleteAll = async () => {
    try {
      await api.deleteAllImages();
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

  const filteredImages = images.filter((img) =>
    img.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">File Manager</h1>
          <p className="text-muted-foreground text-lg">
            Manage your uploaded images
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <CyberButton variant="danger" size="sm" disabled={images.length === 0}>
                <Trash2 className="w-4 h-4" />
                Delete All
              </CyberButton>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass-panel border-border/50">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete All Images?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your uploaded images and their analysis data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-muted hover:bg-muted/80">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAll} className="bg-destructive hover:bg-destructive/80">
                  Delete All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Search and View Toggle */}
      <GlassCard className="flex flex-col md:flex-row md:items-center gap-4 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-border/50"
          />
        </div>
        <div className="flex items-center gap-2 p-1 rounded-lg bg-muted/50">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </GlassCard>

      {/* Image Grid/List */}
      {isLoading ? (
        <LoadingState message="Loading your images..." />
      ) : error ? (
        <ApiErrorState error={error} onRetry={fetchImages} title="Failed to load images" />
      ) : filteredImages.length === 0 ? (
        <GlassCard className="text-center py-16">
          <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Images Found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? "No images match your search" : "Upload your first image to get started"}
          </p>
          <CyberButton asChild>
            <Link to="/dashboard/upload">Upload Image</Link>
          </CyberButton>
        </GlassCard>
      ) : viewMode === "grid" ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          layout
        >
          <AnimatePresence>
            {filteredImages.map((image, index) => (
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
                        <CyberButton size="sm" variant="outline" asChild className="flex-1">
                          <Link to={`/dashboard/analysis/${image.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </CyberButton>
                        <CyberButton
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(image.id)}
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
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="flex items-center gap-4 p-4">
                  <img
                    src={image.original_url}
                    alt={image.filename}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{image.filename}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(image.uploaded_at).toLocaleString()}
                    </p>
                  </div>
                  {getStatusBadge(image.analysis)}
                  <div className="flex gap-2">
                    <CyberButton size="sm" variant="outline" asChild>
                      <Link to={`/dashboard/analysis/${image.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </CyberButton>
                    <CyberButton
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(image.id)}
                      isLoading={deletingId === image.id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </CyberButton>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default FileManager;
