import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { CyberButton } from "@/components/ui/CyberButton";
import { api, Image as ImageType, AnalysisResult } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  Image,
  Loader2,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  Layers,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

const AnalysisViewer = () => {
  const { id } = useParams<{ id: string }>();
  const [image, setImage] = useState<ImageType | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<"original" | "heatmap" | "mask" | "compare">("original");
  const [comparePosition, setComparePosition] = useState(50);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const imageData = await api.getImage(id!);
      setImage(imageData);
      
      try {
        const analysisData = await api.getAnalysis(id!);
        setAnalysis(analysisData);
      } catch {
        // Analysis might not exist yet
      }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!image) {
    return (
      <GlassCard className="text-center py-16">
        <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Image Not Found</h3>
        <p className="text-muted-foreground mb-6">
          The requested image could not be found.
        </p>
        <CyberButton asChild>
          <Link to="/dashboard/files">Back to Files</Link>
        </CyberButton>
      </GlassCard>
    );
  }

  const viewOptions = [
    { id: "original", label: "Original", icon: Image },
    { id: "heatmap", label: "Heatmap", icon: Layers, disabled: !analysis?.phase1_heatmap },
    { id: "mask", label: "Mask", icon: Layers, disabled: !analysis?.phase2_mask },
    { id: "compare", label: "Compare", icon: ZoomIn, disabled: !analysis?.phase1_heatmap },
  ];

  const getCurrentImage = () => {
    switch (activeView) {
      case "heatmap":
        return analysis?.phase1_heatmap || image.original_url;
      case "mask":
        return analysis?.phase2_mask || image.original_url;
      default:
        return image.original_url;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4">
        <CyberButton variant="ghost" size="sm" asChild>
          <Link to="/dashboard/files">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </CyberButton>
        <div>
          <h1 className="text-3xl font-bold gradient-text">{image.filename}</h1>
          <p className="text-muted-foreground">
            Uploaded {new Date(image.uploaded_at).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Viewer */}
        <div className="lg:col-span-2 space-y-4">
          {/* View Options */}
          <GlassCard className="flex flex-wrap gap-2 p-3">
            {viewOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveView(option.id as typeof activeView)}
                disabled={option.disabled}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeView === option.id
                    ? "bg-gradient-cyber text-primary-foreground"
                    : option.disabled
                    ? "text-muted-foreground/50 cursor-not-allowed"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <option.icon className="w-4 h-4" />
                {option.label}
              </button>
            ))}
          </GlassCard>

          {/* Main Image Display */}
          <GlassCard className="relative overflow-hidden">
            {activeView === "compare" ? (
              <div className="relative aspect-video">
                <img
                  src={image.original_url}
                  alt="Original"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ transform: `scale(${zoom})` }}
                />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${comparePosition}%` }}
                >
                  <img
                    src={analysis?.phase1_heatmap || image.original_url}
                    alt="Analysis"
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ 
                      transform: `scale(${zoom})`,
                      width: `${100 / (comparePosition / 100)}%`
                    }}
                  />
                </div>
                <div
                  className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize"
                  style={{ left: `${comparePosition}%` }}
                />
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center overflow-hidden">
                <img
                  src={getCurrentImage()}
                  alt={activeView}
                  className="max-w-full max-h-full object-contain transition-transform duration-300"
                  style={{ transform: `scale(${zoom})` }}
                />
              </div>
            )}
          </GlassCard>

          {/* Zoom Controls */}
          <GlassCard className="flex items-center gap-4 p-4">
            <ZoomOut className="w-5 h-5 text-muted-foreground" />
            <Slider
              value={[zoom]}
              onValueChange={([value]) => setZoom(value)}
              min={0.5}
              max={3}
              step={0.1}
              className="flex-1"
            />
            <ZoomIn className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground w-16 text-center">
              {(zoom * 100).toFixed(0)}%
            </span>
          </GlassCard>

          {activeView === "compare" && (
            <GlassCard className="p-4">
              <p className="text-sm text-muted-foreground mb-2">Compare Position</p>
              <Slider
                value={[comparePosition]}
                onValueChange={([value]) => setComparePosition(value)}
                min={0}
                max={100}
                step={1}
              />
            </GlassCard>
          )}
        </div>

        {/* Analysis Info */}
        <div className="space-y-6">
          {/* Status */}
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">Detection Status</h3>
            {analysis ? (
              <div className={`p-6 rounded-xl text-center ${
                analysis.prediction === "forged"
                  ? "bg-destructive/10 border border-destructive/30"
                  : analysis.prediction === "authentic"
                  ? "bg-secondary/10 border border-secondary/30"
                  : "bg-muted/30 border border-border/50"
              }`}>
                {analysis.prediction === "forged" ? (
                  <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-destructive" />
                ) : analysis.prediction === "authentic" ? (
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-secondary" />
                ) : (
                  <Loader2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground animate-spin" />
                )}
                <p className="text-2xl font-bold capitalize">{analysis.prediction}</p>
              </div>
            ) : (
              <div className="p-6 rounded-xl text-center bg-muted/30 border border-border/50">
                <Search className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-lg font-medium">Not Analyzed</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Run analysis to detect forgery
                </p>
              </div>
            )}
          </GlassCard>

          {/* Probabilities */}
          {analysis && analysis.probability_forged !== undefined && (
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4">Probability Score</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-destructive">Forged</span>
                    <span className="font-medium">
                      {(analysis.probability_forged * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={analysis.probability_forged * 100}
                    className="h-3 bg-muted"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-secondary">Authentic</span>
                    <span className="font-medium">
                      {(analysis.probability_authentic! * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={analysis.probability_authentic! * 100}
                    className="h-3 bg-muted"
                  />
                </div>
              </div>
            </GlassCard>
          )}

          {/* Analysis Phases */}
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">Analysis Phases</h3>
            <div className="space-y-3">
              <div className={`flex items-center justify-between p-3 rounded-lg ${
                analysis?.phase1_complete ? "bg-secondary/10" : "bg-muted/30"
              }`}>
                <span>Phase 1: ELA</span>
                {analysis?.phase1_complete ? (
                  <CheckCircle className="w-5 h-5 text-secondary" />
                ) : (
                  <span className="text-xs text-muted-foreground">Pending</span>
                )}
              </div>
              <div className={`flex items-center justify-between p-3 rounded-lg ${
                analysis?.phase2_complete ? "bg-secondary/10" : "bg-muted/30"
              }`}>
                <span>Phase 2: CNN</span>
                {analysis?.phase2_complete ? (
                  <CheckCircle className="w-5 h-5 text-secondary" />
                ) : (
                  <span className="text-xs text-muted-foreground">Pending</span>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Actions */}
          {!analysis?.phase2_complete && (
            <CyberButton className="w-full" asChild>
              <Link to="/dashboard/upload">Run Analysis</Link>
            </CyberButton>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisViewer;
