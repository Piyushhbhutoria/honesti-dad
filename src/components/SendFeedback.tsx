import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MessageSquare, Send, Shield } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-foreground/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!feedbackRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 flex items-center justify-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="text-center relative z-10">
          <div className="glass-card p-8 max-w-md mx-auto">
            <div className="glass-card bg-red-500/10 p-4 w-fit mx-auto mb-6">
              <MessageSquare className="h-12 w-12 text-red-500 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Feedback Request Not Found</h2>
            <p className="text-foreground/70 mb-6">This feedback link may have expired or been deactivated.</p>
            <Button
              onClick={() => navigate('/')}
              variant="glass-indigo"
              className="px-6 py-3 font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="glass-card bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 w-fit mx-auto mb-6 shadow-glass">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
            Send Anonymous Feedback to {feedbackRequest.name}
          </h1>
          <p className="text-lg text-foreground/70">
            Your message will be completely anonymous. Be honest and constructive!
          </p>
        </div>

        <Card className="shadow-glass border-0 hover:shadow-glass-hover transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-center text-foreground">
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
                  className="min-h-32 text-base glass-card bg-glass-light border-glass-border resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  maxLength={2000}
                  disabled={isSubmitting}
                />
                <p className="text-sm text-foreground/60 mt-2">
                  {message.length}/2000 characters
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  disabled={!message.trim() || isSubmitting}
                  className="flex-1 glass-button bg-indigo-500 hover:bg-indigo-600 text-white py-3 font-semibold border-0 transition-all duration-300 transform hover:scale-105"
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
                  variant="glass"
                  className="flex-1 text-foreground/70 hover:text-foreground py-3 font-semibold transition-all duration-300 transform hover:scale-105"
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
          <div className="glass-card p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-medium text-foreground">100% Anonymous</span>
            </div>
            <p className="text-sm text-foreground/70">
              Your message is completely anonymous. The recipient will not know who sent it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendFeedback;
