
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

          setMessages(messagesData || []);
        }
      } catch (error) {
        console.error('Error loading inbox data:', error);
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
    user
  };
};
