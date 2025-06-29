import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ExternalLink, Instagram } from "lucide-react";

interface FeedbackRequest {
  id: string;
  unique_slug: string;
  name: string;
}

interface InstagramSharingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  feedbackRequest: FeedbackRequest | null;
  onFallbackShare: () => void;
  contentAlreadyCopied: boolean;
}

const InstagramSharingDialog = ({
  isOpen,
  onClose,
  feedbackRequest,
  onFallbackShare,
  contentAlreadyCopied
}: InstagramSharingDialogProps) => {

  const handleOpenInstagram = () => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      // Try to open Instagram app first
      try {
        window.location.href = 'instagram://camera';

        // Fallback to web if app doesn't open
        setTimeout(() => {
          window.open('https://www.instagram.com/', '_blank');
        }, 2000);
      } catch (error) {
        window.open('https://www.instagram.com/', '_blank');
      }
    } else {
      // Desktop: Open Instagram web
      window.open('https://www.instagram.com/', '_blank');
    }

    onClose();
  };

  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="glass-card bg-gradient-to-br from-primary to-primary/80 p-2 shadow-glass">
            <Instagram className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Share to Instagram</h3>
        </div>

        <div className="space-y-6">
          {/* Success Message */}
          {contentAlreadyCopied && (
            <div className="glass bg-primary/5 border-primary/10 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-primary font-medium">
                  ✅ Content copied to clipboard!
                </span>
              </div>
            </div>
          )}

          {/* Steps */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Follow these steps:</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="glass-card bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                <span className="text-muted-foreground">Click "Open Instagram" below</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="glass-card bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                <span className="text-muted-foreground">{isMobile ? "Create a new Story" : "Create a new Story or Post"}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="glass-card bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                <span className="text-muted-foreground">Add text to your story/post</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="glass-card bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                <span className="text-muted-foreground">Paste your copied message</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Button
              onClick={handleOpenInstagram}
              variant="gradient-primary"
              className="w-full py-3 font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Instagram
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstagramSharingDialog; 
