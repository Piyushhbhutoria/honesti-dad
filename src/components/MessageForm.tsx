
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const MessageForm = () => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please write a message before sending");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Your anonymous message has been sent! 🎉");
    setMessage("");
    setIsSubmitting(false);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-2xl w-fit mx-auto mb-6">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Send an Anonymous Message
          </h2>
          <p className="text-lg text-gray-600">
            Share your honest thoughts without revealing your identity
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-gray-700">To: John Doe</CardTitle>
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
          <p className="text-sm text-gray-500">
            Your message will be delivered anonymously. The recipient will not know who sent it.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MessageForm;
