import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { CyberButton } from "@/components/ui/CyberButton";
import { api, AnalysisResult } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import {
  Upload as UploadIcon,
  Image,
  Scan,
  CheckCircle,
  AlertTriangle,
  Loader2,
  X,
  Zap,
  Brain,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentPhase, setCurrentPhase] = useState<0 | 1 | 2>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setUploadedImageId(null);
      setAnalysisResult(null);
      setCurrentPhase(0);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setUploadedImageId(null);
      setAnalysisResult(null);
      setCurrentPhase(0);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await api.uploadImage(file);
      setUploadedImageId(result.id);
      toast({
        title: "Upload Successful",
        description: "Image uploaded and ready for analysis.",
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const runPhase1 = async () => {
    if (!uploadedImageId) return;

    setIsAnalyzing(true);
    setCurrentPhase(1);
    try {
      const result = await api.runPhase1(uploadedImageId);
      setAnalysisResult(result);
      toast({
        title: "Phase 1 Complete",
        description: "Initial analysis completed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runPhase2 = async () => {
    if (!uploadedImageId) return;

    setIsAnalyzing(true);
    setCurrentPhase(2);
    try {
      const result = await api.runPhase2(uploadedImageId);
      setAnalysisResult(result);
      toast({
        title: "Phase 2 Complete",
        description: "Deep analysis completed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearUpload = () => {
    setFile(null);
    setPreview(null);
    setUploadedImageId(null);
    setAnalysisResult(null);
    setCurrentPhase(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Upload & Analyze</h1>
        <p className="text-muted-foreground text-lg">
          Upload an image to detect potential forgery using AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <GlassCard className="h-fit">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <UploadIcon className="w-5 h-5 text-primary" />
            Image Upload
          </h2>

          <AnimatePresence mode="wait">
            {!preview ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-2 border-dashed border-border/50 rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                  <Image className="w-10 h-10 text-primary" />
                </div>
                <p className="text-lg font-medium mb-2">
                  Drag & Drop or Click to Upload
                </p>
                <p className="text-muted-foreground text-sm">
                  Supports PNG, JPG, JPEG up to 10MB
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative"
              >
                <button
                  onClick={clearUpload}
                  className="absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground shadow-lg hover:scale-110 transition-transform"
                >
                  <X className="w-4 h-4" />
                </button>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full rounded-xl shadow-lg"
                />
                <div className="mt-4 p-3 rounded-lg bg-muted/30">
                  <p className="font-medium truncate">{file?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file?.size || 0 / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {!uploadedImageId && (
                  <CyberButton
                    onClick={handleUpload}
                    isLoading={isUploading}
                    className="w-full mt-4"
                  >
                    <UploadIcon className="w-5 h-5" />
                    Upload Image
                  </CyberButton>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>

        {/* Analysis Section */}
        <div className="space-y-6">
          {/* Analysis Controls */}
          <GlassCard>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Scan className="w-5 h-5 text-secondary" />
              Analysis Pipeline
            </h2>

            <div className="space-y-4">
              {/* Phase 1 */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      currentPhase >= 1 ? "bg-primary" : "bg-muted"
                    }`}>
                      <Zap className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Phase 1: Initial Analysis</p>
                      <p className="text-sm text-muted-foreground">
                        Error Level Analysis & Heatmap Generation
                      </p>
                    </div>
                  </div>
                  {analysisResult?.phase1_complete && (
                    <CheckCircle className="w-6 h-6 text-secondary" />
                  )}
                </div>
                <CyberButton
                  onClick={runPhase1}
                  disabled={!uploadedImageId || isAnalyzing}
                  isLoading={isAnalyzing && currentPhase === 1}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Run Phase 1
                </CyberButton>
              </div>

              {/* Phase 2 */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      currentPhase >= 2 ? "bg-accent" : "bg-muted"
                    }`}>
                      <Brain className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Phase 2: Deep Analysis</p>
                      <p className="text-sm text-muted-foreground">
                        CNN-based Mask & Probability Prediction
                      </p>
                    </div>
                  </div>
                  {analysisResult?.phase2_complete && (
                    <CheckCircle className="w-6 h-6 text-secondary" />
                  )}
                </div>
                <CyberButton
                  onClick={runPhase2}
                  disabled={!uploadedImageId || !analysisResult?.phase1_complete || isAnalyzing}
                  isLoading={isAnalyzing && currentPhase === 2}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Run Phase 2
                </CyberButton>
              </div>
            </div>
          </GlassCard>

          {/* Results */}
          {analysisResult && (
            <GlassCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                {analysisResult.prediction === "forged" ? (
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-secondary" />
                )}
                Analysis Results
              </h2>

              <div className={`p-6 rounded-xl text-center mb-6 ${
                analysisResult.prediction === "forged"
                  ? "bg-destructive/10 border border-destructive/30"
                  : analysisResult.prediction === "authentic"
                  ? "bg-secondary/10 border border-secondary/30"
                  : "bg-muted/30 border border-border/50"
              }`}>
                <p className="text-3xl font-bold capitalize mb-2">
                  {analysisResult.prediction}
                </p>
                <p className="text-muted-foreground">Detection Result</p>
              </div>

              {analysisResult.probability_forged !== undefined && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Forged Probability</span>
                      <span className="text-destructive font-medium">
                        {(analysisResult.probability_forged * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={analysisResult.probability_forged * 100} 
                      className="h-2 bg-muted"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Authentic Probability</span>
                      <span className="text-secondary font-medium">
                        {(analysisResult.probability_authentic! * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={analysisResult.probability_authentic! * 100} 
                      className="h-2 bg-muted"
                    />
                  </div>
                </div>
              )}
            </GlassCard>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Upload;
