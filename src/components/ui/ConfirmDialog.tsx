import { ReactNode } from "react";
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
import { CyberButton } from "@/components/ui/CyberButton";
import { AlertTriangle, Trash2, LogOut, LucideIcon } from "lucide-react";

interface ConfirmDialogProps {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  icon?: LucideIcon;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const ConfirmDialog = ({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  icon: Icon,
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) => {
  const variantStyles = {
    danger: {
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
      buttonClass: "bg-destructive hover:bg-destructive/80",
      DefaultIcon: Trash2,
    },
    warning: {
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-500",
      buttonClass: "bg-yellow-500 hover:bg-yellow-500/80",
      DefaultIcon: AlertTriangle,
    },
    default: {
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      buttonClass: "bg-primary hover:bg-primary/80",
      DefaultIcon: AlertTriangle,
    },
  };

  const styles = variantStyles[variant];
  const DisplayIcon = Icon || styles.DefaultIcon;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="glass-panel border-border/50">
        <AlertDialogHeader>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center`}>
              <DisplayIcon className={`w-6 h-6 ${styles.iconColor}`} />
            </div>
            <div>
              <AlertDialogTitle className="text-lg">{title}</AlertDialogTitle>
              <AlertDialogDescription className="mt-1">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="bg-muted hover:bg-muted/80 border-0">
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={styles.buttonClass}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
