
import { Button } from "@/components/ui/button";
import { MessageSquare, Copy } from "lucide-react";
import { Instagram } from "lucide-react";
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
      <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-2xl w-fit mx-auto mb-6">
        <MessageSquare className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Your Message Inbox
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        {messagesCount > 0 
          ? "Here are the anonymous messages you've received" 
          : "No messages yet - share your link to start receiving feedback!"}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handleInstagramShare}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Instagram className="h-4 w-4 mr-2" />
          {feedbackRequest ? "Share to Instagram" : "Create Feedback Link"}
        </Button>
        <Button
          onClick={onCopyLink}
          variant="outline" 
          className="border-purple-200 text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
        >
          <Copy className="h-4 w-4 mr-2" />
          {feedbackRequest ? "Copy Link" : "Get Started"}
        </Button>
      </div>
    </div>
  );
};

export default InboxHeader;
