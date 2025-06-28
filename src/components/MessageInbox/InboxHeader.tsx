
import { Button } from "@/components/ui/button";
import { Copy, Instagram, MessageSquare } from "lucide-react";
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
  const handleInstagramShare = () => {
    if (!feedbackRequest) {
      onShare(); // Fallback to original share behavior if no feedback request
      return;
    }

    const feedbackUrl = `${window.location.origin}/feedback/${feedbackRequest.unique_slug}`;
    const shareText = `Send me an anonymous message! 💬\n\n${feedbackUrl}`;

    // Copy the text and link to clipboard first
    navigator.clipboard.writeText(shareText).then(() => {
      toast.success("Message and link copied! Now opening Instagram...", {
        description: "Paste this in your Instagram story after it opens"
      });
    });

    // Detect if user is on mobile
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      // Try to open Instagram app directly
      const instagramUrl = `instagram://story-camera`;
      window.location.href = instagramUrl;

      // Fallback to web version if app doesn't open
      setTimeout(() => {
        window.open('https://www.instagram.com/', '_blank');
      }, 2000);
    } else {
      // For desktop, open Instagram web directly
      window.open('https://www.instagram.com/', '_blank');
    }
  };

  return (
    <div className="text-center mb-12">
      <div className="glass-card bg-gradient-to-br from-primary to-primary/90 p-3 w-fit mx-auto mb-6 shadow-glass">
        <MessageSquare className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent">
        Your Message Inbox
      </h2>
      <p className="text-lg text-foreground/70 mb-8">
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
  );
};

export default InboxHeader;
