
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useInboxData } from "./MessageInbox/useInboxData";
import InboxHeader from "./MessageInbox/InboxHeader";
import MessageCard from "./MessageInbox/MessageCard";
import EmptyState from "./MessageInbox/EmptyState";
import LoadingState from "./MessageInbox/LoadingState";

const MessageInbox = () => {
  const [thankedMessages, setThankedMessages] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { messages, feedbackRequest, isLoading, authLoading, user } = useInboxData();

  const getFeedbackUrl = () => {
    if (!feedbackRequest) return null;
    return `${window.location.origin}/feedback/${feedbackRequest.unique_slug}`;
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

  const handleThankSender = (messageId: string) => {
    setThankedMessages(prev => new Set(prev).add(messageId));
    toast.success("Thank you sent! The sender will know you appreciated their message. 💜");
  };

  if (authLoading || isLoading) {
    return <LoadingState />;
  }

  // Hide the section completely when no active session
  if (!user) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 max-w-4xl">
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
              thankedMessages={thankedMessages}
              onThankSender={handleThankSender}
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
