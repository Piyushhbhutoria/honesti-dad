
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const SendFeedback = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch feedback request by slug
  const { data: feedbackRequest, isLoading } = useQuery({
    queryKey: ['feedback-request-by-slug', slug],
    queryFn: async () => {
      if (!slug) throw new Error('No slug provided');
      
      const { data, error } = await supabase
        .from('feedback_requests')
        .select('id, name, is_active')
        .eq('unique_slug', slug)
        .eq('is_active', true)
        .single();
      
      if (error) {
        console.error('Error fetching feedback request:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!slug,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (!feedbackRequest) {
      toast.error("Feedback request not found");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('anonymous_messages')
        .insert({
          feedback_request_id: feedbackRequest.id,
          content: message.trim()
        });

      if (error) throw error;

      toast.success("Your anonymous message has been sent! 🎉");
      setMessage("");
      
      // Navigate to a thank you page or back
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!feedbackRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Feedback Request Not Found</h2>
          <p className="text-gray-600 mb-6">This feedback link may have expired or been deactivated.</p>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-2xl w-fit mx-auto mb-6">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Send Anonymous Feedback to {feedbackRequest.name}
          </h1>
          <p className="text-lg text-gray-600">
            Your message will be completely anonymous. Be honest and constructive!
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-gray-700">
              Share Your Thoughts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your anonymous message here... Be honest, constructive, and respectful."
                  className="min-h-32 text-base"
                  maxLength={2000}
                  disabled={isSubmitting}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {message.length}/2000 characters
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  disabled={!message.trim() || isSubmitting}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Anonymous Message
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 py-3 rounded-xl font-semibold transition-all duration-300"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Your message is completely anonymous. The recipient will not know who sent it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SendFeedback;
