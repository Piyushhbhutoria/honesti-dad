import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Share2, Copy, Clock, Heart, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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

const MessageInbox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [feedbackRequest, setFeedbackRequest] = useState<FeedbackRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [thankedMessages, setThankedMessages] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const handleThankSender = (messageId: string) => {
    if (thankedMessages.has(messageId)) {
      toast.info("You've already thanked the sender for this message!");
      return;
    }
    
    setThankedMessages(prev => new Set(prev).add(messageId));
    toast.success("Thank you sent! The sender will know you appreciated their message. 💜");
  };

  if (authLoading || isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show sign-in prompt for non-authenticated users
  if (!user) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-2xl w-fit mx-auto mb-6">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Your Personal Inbox
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Sign in to create your feedback link and view anonymous messages sent to you
            </p>
            
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg max-w-md mx-auto">
              <MessageSquare className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Get Started</h3>
              <p className="text-gray-600 mb-6">
                Create an account to generate your personal feedback link and start receiving anonymous messages
              </p>
              <Button
                onClick={() => navigate('/auth')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In to Continue
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-2xl w-fit mx-auto mb-6">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Your Message Inbox
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {messages.length > 0 
              ? "Here are the anonymous messages you've received" 
              : "No messages yet - share your link to start receiving feedback!"}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleShare}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Share2 className="h-4 w-4 mr-2" />
              {feedbackRequest ? "Share Your Link" : "Create Feedback Link"}
            </Button>
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="border-purple-200 text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              <Copy className="h-4 w-4 mr-2" />
              {feedbackRequest ? "Copy Link" : "Get Started"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {messages.map((message, index) => (
            <Card 
              key={message.id} 
              className={`shadow-lg border-0 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-purple-500" />
                    <CardTitle className="text-lg text-gray-700">Anonymous Message</CardTitle>
                    {!message.is_read && (
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                        New
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTimestamp(message.created_at)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {message.content}
                </p>
                <div className="flex items-center justify-between">
                  <Button
                    onClick={() => handleThankSender(message.id)}
                    variant="ghost"
                    size="sm"
                    className={`transition-all duration-300 ${
                      thankedMessages.has(message.id)
                        ? "text-pink-600 bg-pink-50 hover:bg-pink-100"
                        : "text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    }`}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${thankedMessages.has(message.id) ? "fill-current" : ""}`} />
                    {thankedMessages.has(message.id) ? "Thanked!" : "Thank sender"}
                  </Button>
                  <div className="text-xs text-gray-400">
                    Message #{message.id.slice(0, 8)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 p-6 rounded-2xl max-w-md mx-auto">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No messages yet</h3>
              <p className="text-gray-500 mb-4">Share your link to start receiving anonymous feedback!</p>
              <Button
                onClick={() => navigate('/request')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                Create Your Link
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MessageInbox;
