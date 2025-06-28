import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface SharingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SharingModal = ({ isOpen, onClose }: SharingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="glass-card bg-gradient-to-br from-primary to-primary/80 p-2 shadow-glass">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Feedback Image Ready!</h3>
        </div>

        <div className="space-y-6">
          {/* Success Message */}
          <div className="glass bg-primary/5 border-primary/10 p-3 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-primary font-medium">
                ✅ Your feedback has been copied to clipboard as an image.
              </span>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Follow these steps:</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="glass-card bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                <span className="text-muted-foreground">Open your favorite social media app</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="glass-card bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                <span className="text-muted-foreground">Create a new post or story</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="glass-card bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                <span className="text-muted-foreground">Paste the image from your clipboard</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="glass-card bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                <span className="text-muted-foreground">Share your gratitude with the world! 🙏</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Button
              onClick={onClose}
              className="w-full"
              variant="gradient-primary"
            >
              Got it! Let's share 🚀
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SharingModal; 
