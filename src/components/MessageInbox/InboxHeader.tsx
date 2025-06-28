import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Instagram, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FeedbackRequest {
  id: string;
  unique_slug: string;
  name: string;
}

interface InboxHeaderProps {
  messagesCount: number;
  feedbackRequest: FeedbackRequest | null;
  onShare: () => void;
  onCopyLink: () => void;
}

const InboxHeader = ({ messagesCount, feedbackRequest, onShare, onCopyLink }: InboxHeaderProps) => {
  const [showInstagramGuide, setShowInstagramGuide] = useState(false);
  const [contentCopied, setContentCopied] = useState(false);

  const handleInstagramShare = async () => {
    if (!feedbackRequest) {
      onShare(); // Fallback to original share behavior if no feedback request
      return;
    }

    const feedbackUrl = `${window.location.origin}/feedback/${feedbackRequest.unique_slug}`;
    const shareText = `Send me an anonymous message! 💬`;
    const fullShareText = `${shareText}\n\n${feedbackUrl}`;

    // Step 1: Copy link to clipboard
    try {
      await navigator.clipboard.writeText(fullShareText);
      setContentCopied(true);
      setShowInstagramGuide(true);
    } catch (error) {
      toast.error("❌ Failed to copy to clipboard", {
        description: "Please manually copy your link and share on Instagram"
      });
    }
  };

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

    setShowInstagramGuide(false);
    setContentCopied(false);
  };

  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-primary/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 text-center mb-12">
        <div className="glass-card bg-gradient-to-br from-primary to-primary/80 p-3 w-fit mx-auto mb-6 shadow-glass">
          <MessageSquare className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Your Message Inbox
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          {messagesCount > 0
            ? "Here are the anonymous messages you've received"
            : "No messages yet - share your link to start receiving feedback!"}
        </p>

        {feedbackRequest && <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleInstagramShare}
            variant="gradient-primary"
            className="px-6 py-3 font-semibold border-0 transition-all duration-300 transform hover:scale-105"
          >
            <Instagram className="h-4 w-4 mr-2" />
            Share to Instagram
          </Button>
          <Button
            onClick={onCopyLink}
            variant="glass-primary"
            className="px-6 py-3 font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        </div>}
      </div>

      {/* Instagram Sharing Guide Popup */}
      {showInstagramGuide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-colors duration-300 ease-in-out">
          <div className="glass shadow-glass border-0 hover:shadow-glass-hover transition-all duration-300 max-w-md w-full mx-auto relative rounded-xl">
            <button
              onClick={() => {
                setShowInstagramGuide(false);
                setContentCopied(false);
              }}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-foreground/10 transition-colors duration-300 ease-in-out focus-ring"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="glass-card bg-gradient-to-br from-primary to-primary/80 p-2 shadow-glass">
                  <Instagram className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Share to Instagram</h3>
              </div>

              {contentCopied && (
                <div className="glass bg-primary/5 border-primary/10 p-3 mb-4 rounded-sm">
                  <p className="text-sm text-primary font-medium">
                    ✅ Content copied to clipboard!
                  </p>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <h4 className="font-medium text-foreground">Follow these steps:</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="glass-card bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                    <span>Click "Open Instagram" below</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="glass-card bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                    <span>{isMobile ? "Create a new Story" : "Create a new Story or Post"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="glass-card bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                    <span>Add text to your story/post</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="glass-card bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                    <span>Paste your copied message</span>
                  </div>
                </div>
              </div>

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
        </div>
      )}
    </>
  );
};

export default InboxHeader;
