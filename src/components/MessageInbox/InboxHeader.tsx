import InstagramSharingDialog from "@/components/InstagramSharingDialog";
import { Button } from "@/components/ui/button";
import HonestBoxIcon from "@/components/ui/HonestBoxIcon";
import { Copy, Instagram } from "lucide-react";
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

    // Copy content to clipboard first
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

  const handleCloseInstagramGuide = () => {
    setShowInstagramGuide(false);
    setContentCopied(false);
  };

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
          <HonestBoxIcon className="h-8 w-8 text-white" />
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

      <InstagramSharingDialog
        isOpen={showInstagramGuide}
        onClose={handleCloseInstagramGuide}
        feedbackRequest={feedbackRequest}
        onFallbackShare={onShare}
        contentAlreadyCopied={contentCopied}
      />
    </>
  );
};

export default InboxHeader;
