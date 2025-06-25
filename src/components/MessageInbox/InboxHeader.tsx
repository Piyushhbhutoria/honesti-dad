
import { Button } from "@/components/ui/button";
import { MessageSquare, Share2, Copy } from "lucide-react";

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
  return (
    <div className="text-center mb-12">
      <div className="ios-glass-card p-3 rounded-2xl w-fit mx-auto mb-6">
        <MessageSquare className="h-8 w-8 text-[#5E5CE6]" />
      </div>
      <h2 className="text-4xl font-bold mb-4 text-[#111111]">
        Your Message Inbox
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        {messagesCount > 0 
          ? "Here are the anonymous messages you've received" 
          : "No messages yet - share your link to start receiving feedback!"}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onShare}
          className="bg-[#5E5CE6] hover:bg-[#4C4AE5] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0"
        >
          <Share2 className="h-4 w-4 mr-2" />
          {feedbackRequest ? "Share Your Link" : "Create Feedback Link"}
        </Button>
        <Button
          onClick={onCopyLink}
          variant="outline"
          className="ios-glass-card hover:bg-[rgba(255,255,255,0.1)] text-[#111111] px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-[rgba(255,255,255,0.1)]"
        >
          <Copy className="h-4 w-4 mr-2" />
          {feedbackRequest ? "Copy Link" : "Get Started"}
        </Button>
      </div>
    </div>
  );
};

export default InboxHeader;
