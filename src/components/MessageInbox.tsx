import { getFeedbackURL } from "@/lib/urlUtils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EmptyState from "./MessageInbox/EmptyState";
import InboxHeader from "./MessageInbox/InboxHeader";
import LoadingState from "./MessageInbox/LoadingState";
import MessageCard from "./MessageInbox/MessageCard";
import { useInboxData } from "./MessageInbox/useInboxData";

const MessageInbox = () => {
  const navigate = useNavigate();
  const {
    messages,
    feedbackRequest,
    isLoading,
    authLoading,
    user,
    markMessageAsRead
  } = useInboxData();

  const getFeedbackUrl = () => {
    if (!feedbackRequest?.unique_slug) return null;
    try {
      return getFeedbackURL(feedbackRequest.unique_slug);
    } catch (error) {
      console.error('Error generating feedback URL:', error);
      return null;
    }
  };

  const handleCopyLink = () => {
    const url = getFeedbackUrl();
    if (url) {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } else {
      navigate('/request');
    }
  };

  const handleShare = () => {
    const url = getFeedbackUrl();
    if (url) {
      if (navigator.share) {
        navigator.share({
          title: "Send me an anonymous message",
          url: url
        });
      } else {
        handleCopyLink();
      }
    } else {
      navigate('/request');
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    await markMessageAsRead(messageId);
  };

  if (authLoading || isLoading) {
    return <LoadingState />;
  }

  // Hide the section completely when no active session
  if (!user) {
    return null;
  }

  return (
    <section className="py-20 relative">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-1/4 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <InboxHeader
          messagesCount={messages.length}
          feedbackRequest={feedbackRequest}
          onShare={handleShare}
          onCopyLink={handleCopyLink}
        />

        <div className="space-y-6">
          {messages.map((message, index) => (
            <MessageCard
              key={message.id}
              message={message}
              index={index}
            />
          ))}
        </div>

        {messages.length === 0 && (
          <EmptyState onCreateLink={() => navigate('/request')} />
        )}
      </div>
    </section>
  );
};

export default MessageInbox;
