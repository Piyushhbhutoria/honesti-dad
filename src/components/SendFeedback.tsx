
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
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Card className="pill-shadow border-0 bg-white/80 backdrop-blur-sm max-w-md mx-4 rounded-3xl">
          <CardHeader className="text-center">
            <div className="bg-[#F76C5E]/20 p-3 rounded-full w-fit mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-[#F76C5E]" />
            </div>
            <CardTitle className="text-[#333333]">Invalid Link</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-[#666666] mb-6">
              This feedback link is not valid or has expired.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="mint-gradient hover:opacity-90 text-white rounded-full spring-bounce hover:scale-105"
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
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="container mx-auto px-4 py-20 max-w-2xl">
        <div className="text-center mb-12">
          <div className="mint-gradient p-3 rounded-full w-fit mx-auto mb-6 pill-shadow">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-[#333333]">
            Send Anonymous Feedback
          </h1>
          <p className="text-lg text-[#666666]">
            Share your honest thoughts with <span className="font-semibold text-[#A1E4B6]">{userName || 'this person'}</span> anonymously
          </p>
        </div>

        <Card className="pill-shadow border-0 bg-white/80 backdrop-blur-sm rounded-3xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-[#333333]">
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
                  className="min-h-32 resize-none rounded-3xl"
                  maxLength={500}
                />
                <div className="text-right text-sm text-[#666666] mt-2">
                  {message.length}/500 characters
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="w-full mint-gradient hover:opacity-90 text-white py-3 rounded-full text-lg font-semibold pill-shadow spring-bounce hover:scale-105 disabled:opacity-50"
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
          <p className="text-sm text-[#666666] mb-4">
            Your message will be delivered anonymously. The recipient will not know who sent it.
          </p>
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-[#A1E4B6] hover:text-[#7DD3A0] hover:bg-[#A1E4B6]/10 rounded-full spring-bounce hover:scale-105"
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
