
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageSquare, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const SendFeedback = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isValidUser, setIsValidUser] = useState(true);
  const [feedbackRequestId, setFeedbackRequestId] = useState<string | null>(null);

  useEffect(() => {
    const checkFeedbackRequest = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('feedback_requests')
          .select('id, name, is_active')
          .eq('unique_slug', userId)
          .eq('is_active', true)
          .single();

        if (error || !data) {
          setIsValidUser(false);
          return;
        }

        setUserName(data.name);
        setFeedbackRequestId(data.id);
      } catch (error) {
        console.error('Error checking feedback request:', error);
        setIsValidUser(false);
      }
    };

    checkFeedbackRequest();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please write a message before sending");
      return;
    }

    if (!feedbackRequestId) return;

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('anonymous_messages')
        .insert({
          feedback_request_id: feedbackRequestId,
          content: message.trim()
        });

      if (error) throw error;

      toast.success("Your anonymous message has been sent! 🎉");
      setMessage("");
      
      // Redirect after successful submission
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

  if (!isValidUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="bg-red-100 p-3 rounded-2xl w-fit mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-gray-700">Invalid Link</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              This feedback link is not valid or has expired.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-20 max-w-2xl">
        <div className="text-center mb-12">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-2xl w-fit mx-auto mb-6">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Send Anonymous Feedback
          </h1>
          <p className="text-lg text-gray-600">
            Share your honest thoughts with <span className="font-semibold text-purple-600">{userName || 'this person'}</span> anonymously
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-gray-700">
              To: {userName || 'Anonymous'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your anonymous message here... Be honest, be kind."
                  className="min-h-32 resize-none border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-500 mt-2">
                  {message.length}/500 characters
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="h-5 w-5 mr-2" />
                    Send Anonymous Message
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Your message will be delivered anonymously. The recipient will not know who sent it.
          </p>
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendFeedback;
