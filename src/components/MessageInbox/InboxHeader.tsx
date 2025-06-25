
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
      <div className="mint-gradient p-3 rounded-full w-fit mx-auto mb-6 pill-shadow">
        <MessageSquare className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-4xl font-bold mb-4 text-[#333333]">
        Your Message Inbox
      </h2>
      <p className="text-lg text-[#666666] mb-8">
        {messagesCount > 0 
          ? "Here are the anonymous messages you've received" 
          : "No messages yet - share your link to start receiving feedback!"}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onShare}
          className="mint-gradient hover:opacity-90 text-white px-6 py-3 rounded-full font-semibold pill-shadow spring-bounce hover:scale-105"
        >
          <Share2 className="h-4 w-4 mr-2" />
          {feedbackRequest ? "Share Your Link" : "Create Feedback Link"}
        </Button>
        <Button
          onClick={onCopyLink}
          variant="outline"
          className="border-[#E0E0E0] text-[#333333] hover:bg-[#A1E4B6]/10 px-6 py-3 rounded-full font-semibold spring-bounce hover:scale-105"
        >
          <Copy className="h-4 w-4 mr-2" />
          {feedbackRequest ? "Copy Link" : "Get Started"}
        </Button>
      </div>
    </div>
  );
};

export default InboxHeader;
