import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface FeedbackRequest {
  id: string;
  unique_slug: string;
  name: string;
}

export const useInboxData = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [feedbackRequest, setFeedbackRequest] = useState<FeedbackRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  // Function to mark messages as read
  const markMessagesAsRead = async (messageIds: string[]) => {
    if (messageIds.length === 0) return;

    try {
      const { error } = await supabase
        .from('anonymous_messages')
        .update({ is_read: true })
        .in('id', messageIds);

      if (error) {
        console.error('Error marking messages as read:', error);
        toast.error('Failed to mark messages as read');
        return false;
      }

      // Update local state
      setMessages(prevMessages =>
        prevMessages.map(message =>
          messageIds.includes(message.id)
            ? { ...message, is_read: true }
            : message
        )
      );

      return true;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      toast.error('Failed to mark messages as read');
      return false;
    }
  };

  // Function to mark a single message as read
  const markMessageAsRead = async (messageId: string) => {
    return markMessagesAsRead([messageId]);
  };

  useEffect(() => {
    const loadInboxData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Get the most recent feedback request for the authenticated user
        const { data: requests, error: requestError } = await supabase
          .from('feedback_requests')
          .select('id, unique_slug, name')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (requestError) throw requestError;

        if (requests && requests.length > 0) {
          const request = requests[0];
          setFeedbackRequest(request);

          // Load messages for this feedback request
          const { data: messagesData, error: messagesError } = await supabase
            .from('anonymous_messages')
            .select('id, content, is_read, created_at')
            .eq('feedback_request_id', request.id)
            .order('created_at', { ascending: false });

          if (messagesError) throw messagesError;

          const messages = messagesData || [];
          setMessages(messages);

          // Automatically mark unread messages as read when they're loaded
          const unreadMessageIds = messages
            .filter(message => !message.is_read)
            .map(message => message.id);

          if (unreadMessageIds.length > 0) {
            // Mark as read in the background (don't wait for it)
            markMessagesAsRead(unreadMessageIds);
          }
        }
      } catch (error) {
        console.error('Error loading inbox data:', error);
        toast.error('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      loadInboxData();
    }
  }, [user, authLoading]);

  return {
    messages,
    feedbackRequest,
    isLoading,
    authLoading,
    user,
    markMessageAsRead,
    markMessagesAsRead
  };
};
